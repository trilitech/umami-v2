import { mnemonic1 } from "../../mocks/mockMnemonic";
import { recoveredPhrases, umamiBackup } from "../../mocks/umamiV1BackupFile";
import { decrypt, encrypt } from "./AES";

const password = "password";

const DECRYPTION_ERROR_MESSAGE = "Error decrypting data: Invalid password";

describe("AES", () => {
  it("encryption and decryption works", async () => {
    const encrypted = await encrypt(mnemonic1, password);
    const decrypted = await decrypt(encrypted, password);

    expect(decrypted).toEqual(mnemonic1);
  });

  it("decryption restores mnemonic from v1 backup file", async () => {
    for (let i = 0; i < umamiBackup.recoveryPhrases.length; i++) {
      const encrypted = umamiBackup.recoveryPhrases[i];
      const expected = recoveredPhrases[i];
      const decrypted = await decrypt(encrypted, "password", "V1");
      expect(decrypted).toEqual(expected);
    }
  });

  it("V1 decryption fails with V2 encryption", async () => {
    const encrypted = await encrypt(mnemonic1, password);

    await expect(decrypt(encrypted, password, "V1")).rejects.toThrowError(DECRYPTION_ERROR_MESSAGE);
  });

  it("decryption fails with cyclic password", async () => {
    // Used to work in V1. Now it fails.
    const encrypted = await encrypt(mnemonic1, "abc");

    await expect(decrypt(encrypted, "abcabc")).rejects.toThrowError(DECRYPTION_ERROR_MESSAGE);
  });

  it("decryption fails with wrong password", async () => {
    const encrypted = await encrypt(mnemonic1, password);

    await expect(decrypt(encrypted, `wrong ${password}`)).rejects.toThrowError(
      DECRYPTION_ERROR_MESSAGE
    );
  });
});
