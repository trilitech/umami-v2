import { User, Passkey } from './types'; // Adjust the import path as necessary

class Database {
  private users: User[] = [];
  private passkeys: Passkey[] = [];

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
      id: Math.random(),
      userName,
    };
    this.users.push(user);
    return user;
  }

  async storePasskey(user: User, passkey: Passkey): Promise<void> {
    this.passkeys.push({ ...passkey, user });
  }

  async setCurrentRegistrationOptions(user: User, options: PublicKeyCredentialCreationOptionsJSON): Promise<void> {
    const foundUser = await this.getUserById(user.id);
    if (foundUser) {
      foundUser.currentRegistrationOptions = options;
    }
  }

   async getCurrentRegistrationOptions(user: User): Promise<PublicKeyCredentialCreationOptionsJSON | undefined> {
    const foundUser = await this.getUserById(user.id);
    return foundUser?.currentRegistrationOptions;
  }

}

export const db = new Database();