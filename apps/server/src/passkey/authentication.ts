import { rpID, origin } from "./config";
import { db } from "./db";
import { Passkey } from "./types";

import { AuthenticationResponseJSON, generateAuthenticationOptions, verifyAuthenticationResponse} from '@simplewebauthn/server';

export const getAuthenticationOptions = async (userName: string) => {

    const user = await db.getUserByUsername(userName);

    if (!user) {
        throw new Error('User not found');
    }
    
const userPasskeys: Passkey[] = await db.getPasskeysForUser(user);

const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
  rpID,
  // Require users to use a previously-registered authenticator
  allowCredentials: userPasskeys.map(passkey => ({
    id: passkey.id,
    transports: passkey.transports,
  })),
  challenge: 'this is a challenge'
});

console.log({options});

// (Pseudocode) Remember this challenge for this user
await db.setCurrentAuthenticationOptions(user, options);

return options;


}

export const verifyAuthentication = async (userId: number, authenticationResponse: AuthenticationResponseJSON) => {  

  const user = await db.getUserById(userId);
  if (!user) {
      throw new Error(`Could not find user ${userId}`);
    }
  // (Pseudocode} Retrieve a passkey from the DB that
  // should match the `id` in the returned credential
  //TODO: credential does it comes from the browser request??
  const passkey = await db.getPasskeyById(authenticationResponse.id);
  if (!passkey) {
      throw new Error(`Could not find passkey ${authenticationResponse.id} for user ${user.id}`);
    }

  // (Pseudocode) Get `options.challenge` that was saved above
  const currentOptions: PublicKeyCredentialRequestOptionsJSON | undefined =
    await db.getCurrentAuthenticationOptions(user);

  if (!currentOptions) {
      throw new Error('No challenge found for user');
    }


  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: authenticationResponse,
      expectedChallenge: currentOptions.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: passkey.id,
        publicKey: passkey.publicKey,
        counter: passkey.counter,
        transports: passkey.transports,
      },
    });
  } catch (error) {
    console.error(error);
  throw new Error('Verification failed');
  }

  let publicKey;
  if(verification.verified) {
    publicKey = await db.getPublicKey(passkey);
  }
  return {verified: verification.verified, publicKey: publicKey};
}