import { User, Passkey, PublicKey } from './types'; // Adjust the import path as necessary

class Database {
  private users: User[] = [];
  private passkeys: Passkey[] = [];
  private publicKeys: PublicKey[] = [];

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserByUsername(userName: string): Promise<User | undefined> {
    return this.users.find(user => user.userName === userName);
  }

  async getUserById(userId: number): Promise<User | undefined> {
    return this.users.find(user => user.id === userId);
  }

  async getPasskeysForUser(user: User): Promise<Passkey[]> {
    return this.passkeys.filter(passkey => passkey.user.id === user.id);
  }

  async getPasskeyById(passkeyId: string): Promise<Passkey | undefined> {
    return this.passkeys.find(passkey => passkey.id === passkeyId);
  }

  async storeUser(userName: string): Promise<User> {
    const user: User = {
      // id: Math.random(),
      id: 123,
      userName,
    };
    this.users.push(user);
    return user;
  }

  async storePasskey(passkey: Passkey): Promise<void> {
    this.passkeys.push(passkey);
  }
  async storePublicKey(passkey: Passkey, publicKey: string, tezosAddress?: string): Promise<void> {
    this.publicKeys.push({
      publicKey: publicKey, 
      id: passkey.id,
      tezosAddress: tezosAddress
    });
  }
  async getPublicKey(passkey: Passkey): Promise<PublicKey | undefined> {
    return this.publicKeys.find(publicKey => publicKey.id === passkey.id);
  }

  async setCurrentRegistrationOptions(user: User, options: PublicKeyCredentialCreationOptionsJSON): Promise<void> {
    const foundUser = await this.getUserById(user.id);
    if (foundUser) {
      foundUser.currentRegistrationOptions = options;
    }
  }
  async setCurrentAuthenticationOptions(user: User, options: PublicKeyCredentialRequestOptionsJSON): Promise<void> {
    const foundUser = await this.getUserById(user.id);
    if (foundUser) {
      foundUser.currentAuthenticationOptions = options;
    }
  }

   async getCurrentAuthenticationOptions(user: User): Promise<PublicKeyCredentialRequestOptionsJSON | undefined> {
    const foundUser = await this.getUserById(user.id);
    return foundUser?.currentAuthenticationOptions;
  }
   async getCurrentRegistrationOptions(user: User): Promise<PublicKeyCredentialCreationOptionsJSON | undefined> {
    const foundUser = await this.getUserById(user.id);
    return foundUser?.currentRegistrationOptions;
  }

}

export const db = new Database();