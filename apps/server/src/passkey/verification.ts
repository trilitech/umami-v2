import { rpID, origin } from "./config";
import { db } from "./db";
import { verifyBody } from "./types";
import  {
    verifyAuthenticationResponse
  } from '@simplewebauthn/server'
// const { body } = req;

// (Pseudocode) Retrieve the logged-in user
// const user: UserModel = getUserFromDB(loggedInUserId);
// // (Pseudocode) Get `options.challenge` that was saved above


export const verify = async ({userId, registrationResponse}: verifyBody): Promise<boolean> => {
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
        //@ts-ignore
    verification = await verifyAuthenticationResponse({
        response: registrationResponse,
        expectedChallenge: currentOptions.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
    });

     ({ verified } = verification);
    } catch (error) {
    console.error(error);
    }

    return verified
  }
