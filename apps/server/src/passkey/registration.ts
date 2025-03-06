import {
    generateRegistrationOptions,
    VerifiedRegistrationResponse,
    verifyRegistrationResponse,
  } from '@simplewebauthn/server';
import { rpID, rpName, origin } from './config';
import { Passkey, User, verifyBody } from './types';
import { db } from './db';


export const getRegistrationOptions =  async (userName: string) => {
    let user = await db.getUserByUsername(userName);
    if (!user) {
        user = await db.storeUser(userName);
    }
    const userPasskeys = user?.id ? await db.getPasskeysForUser(user) : [];

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
      });
      await db.setCurrentRegistrationOptions(user, options);
      await db.storePasskey
      console.log({users: await db.getUsers()});
    return {options, userId: user.id};
    
}

export const verifyRegistration = async ({userId, registrationResponse}: verifyBody) => {
  console.log('registrationResponse',{registrationResponse});
    const user = await db.getUserById(userId);
    if(!user) {
        throw new Error('User not found');
    }
    const currentOptions: PublicKeyCredentialCreationOptionsJSON | undefined = await db.getCurrentRegistrationOptions(user);

    const passkey = await db.getPasskeysForUser(user)
    console.log('passkey', {passkey});
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

     ({ verified } = verification);
    } catch (error) {
    console.error(error);
    throw new Error('Verification failed');
    }

    if(verification && verified) {
      await createPasskey(user, verification, currentOptions);
    }
    return verification
  }


  const createPasskey = async (user: User, verification: VerifiedRegistrationResponse, currentOptions: PublicKeyCredentialCreationOptionsJSON) => {
    const { registrationInfo } = verification;

    if(!registrationInfo) {
      throw new Error('No registration info found');
    }
    const {
      credential,
      credentialDeviceType,
      credentialBackedUp,
    } = registrationInfo;
    
    const newPasskey: Passkey = {
      // `user` here is from Step 2
      user,
      // Created by `generateRegistrationOptions()` in Step 1
      webAuthnUserID: currentOptions.user.id,
      // A unique identifier for the credential
      id: credential.id,
      // The public key bytes, used for subsequent authentication signature verification
      publicKey: credential.publicKey,
      // The number of times the authenticator has been used on this site so far
      counter: credential.counter,
      // How the browser can talk with this credential's authenticator
      transports: credential.transports,
      // Whether the passkey is single-device or multi-device
      deviceType: credentialDeviceType,
      // Whether the passkey has been backed up in some way
      backedUp: credentialBackedUp,
    };
    
    // (Pseudocode) Save the authenticator info so that we can
    // get it by user ID later
    await db.storePasskey(newPasskey);
  }