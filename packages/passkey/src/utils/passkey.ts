import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import { TezosToolkit } from '@taquito/taquito';
// import { importKey } from '@taquito/utils';
import { InMemorySigner } from '@taquito/signer';
import { PasskeySigner } from "./signer";

// const tezos = new TezosToolkit('https://mainnet.api.tez.ie');
const tezos = new TezosToolkit('https://ghostnet.tezos.ecadinfra.com');

export const broadcastTransaction = async ({transactionData, credentialId, publicKeyBuffer}: {transactionData: any, credentialId: string, publicKeyBuffer: ArrayBuffer }) => {
  console.log('broadcastTransaction'), {transactionData, credentialId, publicKeyBuffer};
  try {
    // Create an InMemorySigner with the public key and signature
    const credentialIdBuffer = new Uint8Array(Buffer.from(credentialId, 'base64'));

    console.log({
      credentialIdBuffer, publicKeyBuffer, from:  transactionData.from
    });
    const passkeySigner = new PasskeySigner(credentialIdBuffer, publicKeyBuffer, transactionData.from);

    tezos.setProvider({ signer: passkeySigner });

    // Prepare the transaction
    // Send the transaction
    const result = await tezos.contract.transfer({
      to: transactionData.to,
      amount: transactionData.amount,
    });
    await result.confirmation();

    console.log('Transaction broadcasted successfully:', result);
    return result;
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    throw error;
  }
};


const domain = "http://localhost:3000/api";

export const registerPasskey = async (userName: string) => {
  const response = await fetch(`${domain}/generate-registration-options`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName
    }),
  });
  const { options, userId } = await response.json();
  let registrationResponse;
  try {
    registrationResponse = await startRegistration({ optionsJSON: options });
  } catch (error) {
    console.log(error);
    throw error
  }

  let verified = false;
  if (registrationResponse) {
    const verificationResp = await fetch(`${domain}/verify-registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        registrationResponse,
      }),
    });
    const verificationJSON = await verificationResp.json();
    if (verificationJSON.verified) {
      verified = true;
      console.log("verified");
    } else {
      console.log("not verified");
    }
  }
  return {
    publicKey: registrationResponse.response.publicKey,
    verified
  }
};

export const authenticatePasskey = async (userName: string) => {
  const resp = await fetch(`${domain}/generate-authentication-options`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName
    }),
  });
  const optionsJSON = await resp.json();
  optionsJSON.challenge = optionsJSON.challenge
  let asseResp;
  try {
    asseResp = await startAuthentication({ optionsJSON });
  } catch (error) {
    console.log(error)
    throw error;
  }

  const verificationResp = await fetch(`${domain}/verify-authentication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(asseResp),
  });

  const verificationJSON = await verificationResp.json();

  if (verificationJSON && verificationJSON.verified) {
    console.log("authenticated");
  } else {
    console.log("not authenticated");
  }
  return verificationJSON
};

// Function to derive a 32-byte seed from a passkey using PBKDF2
async function generateKeyFromPasskey(passkey: string) {
  const encoder = new TextEncoder();
  const passkeyBytes = encoder.encode(passkey);
  // Use a fixed salt for demonstration; in a real app, generate a random salt and store it securely.
  const salt = encoder.encode('unique-salt-value');

  // Import the passkey as key material for PBKDF2
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    passkeyBytes,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  // Derive 256 bits (32 bytes) from the passkey
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,  // Increase iterations for stronger security in production
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );

  const seed = new Uint8Array(derivedBits);
  // Generate the key pair using TweetNaCl from the derived seed
  return nacl.sign.keyPair.fromSeed(seed);
}

// Function to sign a transaction using the derived key pair
export const signTransaction = async (passkey: string, transactionData: any) => {
  // Derive the key pair from the passkey
  const keyPair = await generateKeyFromPasskey(passkey);

  // Convert transaction data (for example, a JSON object) into a Uint8Array
  const encoder = new TextEncoder();
  const txBytes = encoder.encode(JSON.stringify(transactionData));

  // Create a signature of the transaction using the private key
  const signature = nacl.sign.detached(txBytes, keyPair.secretKey);

  // Convert the private key to the appropriate format for Taquito
  const privateKey = naclUtil.encodeBase64(keyPair.secretKey);

  // Return the signature and public key, both encoded in Base64 for easy transport/verification
  return {
    signature: naclUtil.encodeBase64(signature),
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    privateKey: privateKey // Include the private key in the response

  };
}

// Example function to demonstrate signing a transaction
export const exampleSignTransaction = async (userName: string) => {
  try {
    // Authenticate the user to get the passkey
    const authResult = await authenticatePasskey(userName);
console.log({authResult});
    if (authResult && authResult.verified) {
      const passkey = authResult.passkey; // Retrieve the passkey from the authentication result

      const tzdemoAddress= "tz1Ypv5akUsBf5Aay3Xj8QaZjqw24YZSJS7g";
      const transactionData = {
        from: tzdemoAddress,
        to: tzdemoAddress,
        amount: 2,
        counter: 1,
        // ... include any additional transaction fields required by Tezos
      };

      const result = await signTransaction(passkey, transactionData);
      console.log("Signature:", result.signature);
      console.log("Public Key:", result.publicKey);

       await broadcastTransaction({transactionData, publicKeyBuffer: authResult.passkeyPublicKey , credentialId: authResult.passkeyId});
    } else {
      console.log("Authentication failed");
    }
  } catch (err) {
    console.error("Error signing transaction:", err);
  }
};