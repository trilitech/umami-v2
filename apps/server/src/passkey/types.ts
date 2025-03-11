import type {
    AuthenticatorTransportFuture,
    CredentialDeviceType,
    Base64URLString,
    AuthenticatorAttestationResponseJSON,
    AuthenticationResponseJSON,
  } from '@simplewebauthn/server';
  
  export type User = {
    id: any;
    userName: string;
    currentRegistrationOptions?: PublicKeyCredentialCreationOptionsJSON;
    currentAuthenticationOptions?: PublicKeyCredentialRequestOptionsJSON;
  };
  
  /**
   * It is strongly advised that credentials get their own DB
   * table, ideally with a foreign key somewhere connecting it
   * to a specific UserModel.
   *
   * "SQL" tags below are suggestions for column data types and
   * how best to store data received during registration for use
   * in subsequent authentications.
   */
  export type Passkey = {
    // SQL: Store as `TEXT`. Index this column
    id: Base64URLString;
    // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
    //      Caution: Node ORM's may map this to a Buffer on retrieval,
    //      convert to Uint8Array as necessary
    publicKey: Uint8Array;
    // SQL: Foreign Key to an instance of your internal user model
    user: User;
    // SQL: Store as `TEXT`. Index this column. A UNIQUE constraint on
    //      (webAuthnUserID + user) also achieves maximum user privacy
    webAuthnUserID: Base64URLString;
    // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
    counter: number;
    // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
    // Ex: 'singleDevice' | 'multiDevice'
    deviceType: CredentialDeviceType;
    // SQL: `BOOL` or whatever similar type is supported
    backedUp: boolean;
    // SQL: `VARCHAR(255)` and store string array as a CSV string
    // Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
    transports?: AuthenticatorTransportFuture[];
  };

  export type PublicKey = {
    id: Base64URLString;
    tezosPublicKey: string;
    tezosAddress?: string;
  }

  export interface RegistrationResponseJSON {
    id: Base64URLString;
    rawId: Base64URLString;
    response: AuthenticatorAttestationResponseJSON;
    authenticatorAttachment?: AuthenticatorAttachment;
    clientExtensionResults: AuthenticationExtensionsClientOutputs;
    type: PublicKeyCredentialType;
}

export type verifyBody = {
  userId: number;
  registrationResponse: RegistrationResponseJSON
};