import { mnemonic1, recoveredPhrases, umamiBackup } from "@umami/test-utils";

import { TOO_MANY_ATTEMPTS_ERROR, decrypt, encrypt } from "./AES";

const password = "password";

const DECRYPTION_ERROR_MESSAGE = "Error decrypting data: Invalid password";

describe("AES", () => {
  it("encryption and decryption works", async () => {
    const encrypted = await encrypt(mnemonic1, password);
    const decrypted = await decrypt(encrypted, password);

    expect(decrypted).toEqual(mnemonic1);
  });

  it("decrypts from v1 backup file", async () => {
    for (let i = 0; i < umamiBackup.recoveryPhrases.length; i++) {
      const encrypted = umamiBackup.recoveryPhrases[i];
      const expected = recoveredPhrases[i];
      const decrypted = await decrypt(encrypted, "password", "V1");
      expect(decrypted).toEqual(expected);
    }
  });

  it("V1 decryption fails with V2 encryption", async () => {
    const encrypted = await encrypt(mnemonic1, password);

    await expect(decrypt(encrypted, password, "V1")).rejects.toThrow(DECRYPTION_ERROR_MESSAGE);
  });

  it("fails the decryption with cyclic password", async () => {
    // Used to work in V1. Now it fails.
    const encrypted = await encrypt(mnemonic1, "abc");

    await expect(decrypt(encrypted, "abcabc")).rejects.toThrow(DECRYPTION_ERROR_MESSAGE);
  });

  it("fails the decryption with wrong password", async () => {
    const encrypted = await encrypt(mnemonic1, password);

    await expect(decrypt(encrypted, `wrong ${password}`)).rejects.toThrow(DECRYPTION_ERROR_MESSAGE);
  });

  it("throws too many attempts error", async () => {
    const encrypted = await encrypt(mnemonic1, password);
    for (let i = 0; i < 3; i++) {
      await expect(decrypt(encrypted, "wrong password")).rejects.toThrow(DECRYPTION_ERROR_MESSAGE);
    }
    await expect(decrypt(encrypted, "wrong password")).rejects.toThrow(TOO_MANY_ATTEMPTS_ERROR);
  });
});
