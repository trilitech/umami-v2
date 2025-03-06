import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
  } from '@simplewebauthn/server';
import { rpID, rpName } from './config';
import { Passkey, User } from './types';
import { db } from './db';


export const getConfig =  async (userName: string) => {
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

      console.log({users: await db.getUsers()});
    return {options, userId: user.id};
    
}