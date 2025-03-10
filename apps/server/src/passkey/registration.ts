import {
  generateRegistrationOptions,
  VerifiedRegistrationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { decodeCredentialPublicKey, cose } from '@simplewebauthn/server/helpers';
import { rpID, rpName, origin } from './config';
import { Passkey, User, verifyBody } from './types';
import { db } from './db';
import bs58check from 'bs58check';
import * as blake from 'blakejs';
// Import Taquito utilities
import { b58cencode, prefix, Prefix } from '@taquito/utils';

export const getRegistrationOptions = async (userName: string) => {
  let user = await db.getUserByUsername(userName);
  if (!user) {
      user = await db.storeUser(userName);
  }
  const userPasskeys = user?.id ? await db.getPasskeysForUser(user) : [];
  const tezosAndEthereumSupportedAlgorithmIDs = [-7];
  const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: user.userName,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: 'none',
      // Prevent users from re-registering existing authenticators
      excludeCredentials: userPasskeys.map(passkey => ({
        id: passkey.id,
        // Optional
        transports: passkey.transports,
      })),
      // See "Guiding use of authenticators via authenticatorSelection" below
      authenticatorSelection: {
        // Defaults
        residentKey: 'preferred',
        userVerification: 'preferred',
        // Optional
        authenticatorAttachment: 'platform',
      },
      supportedAlgorithmIDs: tezosAndEthereumSupportedAlgorithmIDs,
    });
    await db.setCurrentRegistrationOptions(user, options);
    await db.storePasskey
  return {options, userId: user.id};
}

export const verifyRegistration = async ({userId, registrationResponse}: verifyBody) : Promise<{
verified: boolean,
publicKey: PublicKeyCredentialJSON | undefined
}> => {
const publicKey = registrationResponse.response.publicKey as string;
  const user = await db.getUserById(userId);
  if(!user) {
      throw new Error('User not found');
  }
  const currentOptions: PublicKeyCredentialCreationOptionsJSON | undefined = await db.getCurrentRegistrationOptions(user);
  if (!currentOptions) {
      throw new Error('No registration options found for user');
  }
  let verification;
  let verified = false;
  try {
  verification = await verifyRegistrationResponse({
      response: registrationResponse,
      expectedChallenge: currentOptions.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
  });
  // if(verification.verified){
  //   const { credentialPublicKey, CosePublicKey } = verification.registrationInfo;
  // }
   ({ verified } = verification);
  } catch (error) {
  console.error(error);
  throw new Error('Verification failed');
  }
  if(verification && verified) {
    const passkey = await createPasskey(user, verification, currentOptions, publicKey);
    await db.storePublicKey(passkey, publicKey);
  }
  return {verified: verification.verified, publicKey: verification.verified ? publicKey : undefined};
}

const createPasskey = async (user: User, verification: VerifiedRegistrationResponse, currentOptions: PublicKeyCredentialCreationOptionsJSON, publicKey: string) => {
  const { registrationInfo } = verification;
  if(!registrationInfo) {
    throw new Error('No registration info found');
  }
  const {
    credential,
    credentialDeviceType,
    credentialBackedUp,
  } = registrationInfo;
  const decoder = new TextDecoder();
  const stringPublicKey = decoder.decode(Buffer.from(credential.publicKey));
  console.log("credential.publicKey", Buffer.from(credential.publicKey).toString('base64'));
  
  // Use a more direct approach with the raw credential public key
  try {
    // Get the COSE key
    const coseKey = decodeCredentialPublicKey(credential.publicKey);
    
    // Access the key properties directly using the Map interface
    // TypeScript doesn't know this is a Map, so we need to cast it
    const coseKeyMap = coseKey as unknown as Map<number, any>;
    
    const keyType = coseKeyMap.get(1); // kty = 1
    const curve = coseKeyMap.get(-1); // crv = -1
    const x = coseKeyMap.get(-2); // x = -2
    const y = coseKeyMap.get(-3); // y = -3
    
    console.log('Key type:', keyType);
    console.log('Curve:', curve);
    console.log('DEBUG - Curve type:', typeof curve);
    
    // Check if it's an EC2 key (Elliptic Curve, kty = 2)
    if (keyType !== 2) { // EC2 = 2
      throw new Error(`Unsupported key type: ${keyType}. Expected EC2 (2)`);
    }
    
    // Check for supported curves (P-256 = 1 or SECP256K1 = 8)
    if (curve !== 1 && curve !== 8) {
      throw new Error(`Unsupported curve: ${curve}. Expected P-256 (1) or SECP256K1 (8)`);
    }
    
    if (!x || !y) {
      throw new Error('Missing x or y coordinates in the public key');
    }
    
    let tezosPublicKey;
    let tezosAddress;
    
    // Create compressed key format (33 bytes): first byte is 0x02 or 0x03 depending on y being even or odd
    const yUint8 = new Uint8Array(y);
    const xUint8 = new Uint8Array(x);
    
    const compressedKey = Buffer.concat([
      Buffer.from([0x02 + (yUint8[yUint8.length - 1] % 2)]), 
      Buffer.from(xUint8)
    ]);
    
    // Handle SECP256K1 curve (for Tezos sppk format and tz2 address)
    if (Number(curve) === 8) { // SECP256K1 = 8
      console.log('Using SECP256K1 curve (8)');
      
      // Generate public key using Taquito
      tezosPublicKey = b58cencode(compressedKey, prefix.sppk);
      console.log('Tezos SECP256K1 public key (sppk):', tezosPublicKey);
      
      // Generate address using Taquito
      try {
        // Hash the public key with BLAKE2b-256
        const publicKeyHash = Buffer.from(blake.blake2b(compressedKey, undefined, 32));
        
        // Take the first 20 bytes and encode with tz2 prefix
        tezosAddress = b58cencode(publicKeyHash.subarray(0, 20), prefix.tz2);
        console.log('Tezos SECP256K1 address (tz2):', tezosAddress);
      } catch (error) {
        console.error('Error generating tz2 address:', error);
      }
    } 
    // Handle P-256 curve (for Tezos p2pk format and tz3 address)
    else if (Number(curve) === 1) { // P-256 = 1
      console.log('Using P-256 curve (1)');
      
      // Generate public key using Taquito
      tezosPublicKey = b58cencode(compressedKey, prefix.p2pk);
      console.log('Tezos P-256 public key (p2pk):', tezosPublicKey);
      
      // Generate address using Taquito
      try {
        // Hash the public key with BLAKE2b-256
        const publicKeyHash = Buffer.from(blake.blake2b(compressedKey, undefined, 32));
        
        // Take the first 20 bytes and encode with tz3 prefix
        tezosAddress = b58cencode(publicKeyHash.subarray(0, 20), prefix.tz3);
        console.log('Tezos P-256 address (tz3):', tezosAddress);
      } catch (error) {
        console.error('Error generating tz3 address:', error);
      }
    }
    
    const newPasskey: Passkey = {
      user,
      webAuthnUserID: currentOptions.user.id,
      id: credential.id,
      publicKey: credential.publicKey,
      counter: credential.counter,
      transports: credential.transports,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
    };
    
    // Save the authenticator info
    await db.storePasskey(newPasskey);
    
    // If we have a Tezos public key and address, store them
    if (tezosPublicKey) {
      await db.storePublicKey(newPasskey, tezosPublicKey, tezosAddress);
    }
    
    return newPasskey;
  } catch (error) {
    console.error('Error processing public key:', error);
    throw error;
  }
}