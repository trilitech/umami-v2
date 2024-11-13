import { decrypt } from "@umami/crypto";
import v21Backup from "@umami/test-utils/backups/V21Backup.json";
import MockDate from "mockdate";

import { useDownloadBackupFile, useRestoreBackup } from "./backup";
import { type UmamiStore, makeStore } from "../store";
import { act, renderHook } from "../testUtils";

const v1Backup = {
  version: "1.0",
  derivationPaths: ["m/44'/1729'/?'/0'"],
  recoveryPhrases: [
    {
      salt: "617a0f520cb1f2d1888957998c153bfe3c29f101012cc9a6b47c1c6fa337f02a",
      iv: "8c254fafd677bf0b0b5c66423af5d05f",
      data: "5606ca8da0c993e84d38e3fd22915a21226fa279f96956b6a82215d96909dbbf67cbf1b3c09c7cc0eda486050fa1c3a3c4aefe4a286c6b38fe1bed15e26a4f113ea07daa9f3c7b5a514fbbbe9bd53340c4a2a0f6cce4be5af452b20086a9f2c1b69197b73530fa98005311aecfbce623c3dded7a0d51629c8cdfe6aefe4a5997c380c04c78262160c24b96d192fa87008dff8260eb76676fe08f1bff4838186a29ebbfc78f3d7951",
    },
  ],
};

const originalWindowLocation = window.location;

beforeAll(() => {
  delete (window as any).location;
  window.location = { reload: jest.fn() } as any;
});
afterAll(() => {
  window.location = originalWindowLocation;
});

const v2Backup = {
  "persist:accounts":
    '{"items":"[{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/0\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3\\"},\\"seedFingerPrint\\":\\"5fd091e1\\",\\"label\\":\\"Restored account 0\\",\\"type\\":\\"mnemonic\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/1\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6\\"},\\"seedFingerPrint\\":\\"5fd091e1\\",\\"label\\":\\"Restored account 1\\",\\"type\\":\\"mnemonic\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/2\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS\\"},\\"seedFingerPrint\\":\\"5fd091e1\\",\\"label\\":\\"Restored account 2\\",\\"type\\":\\"mnemonic\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/3\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkuU8mocvqi2qSB5BunXueNEqV46AU9JzTSno1Njr3h2Waa9kPGh\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1MrbHXHu5dHwWKWsSxP3J57Td4a13T4v21Q\\"},\\"seedFingerPrint\\":\\"5fd091e1\\",\\"label\\":\\"htrthrh\\",\\"type\\":\\"mnemonic\\"},{\\"derivationPath\\":\\"44\'/1729\'/?\'/0\'\\",\\"curve\\":\\"ed25519\\",\\"type\\":\\"ledger\\",\\"pk\\":\\"sppk7ZrrFmeLtGyDchMcGGMv1SDYpNQeexqwem3F3RByWkyWdgAxpy5\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz2FMghcbuooCeh2yL6MnK33ywCDksD8x5Q1\\"},\\"label\\":\\"Bahador\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/4\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkv2YM4m3B3X5hDBQUHXzjwSDuwn8yQBdwXk2QLpwTW7XMbJSunM\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1hdGCexsPWGxbCFsPjqAuuJAP2cumXwMxz\\"},\\"seedFingerPrint\\":\\"5fd091e1\\",\\"label\\":\\"12asd\\",\\"type\\":\\"mnemonic\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/0\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkvWu5C4wjmwKvbZu726N4h7SvqfTRaiamB6z8dTvd1qUnE6YQcP\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1cEY5rPtqLMP3K1Bhs2RLfbCi5dpKvP3jL\\"},\\"seedFingerPrint\\":\\"fa3f3982\\",\\"label\\":\\"test\\",\\"type\\":\\"mnemonic\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/0\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkvJ7tLYQXFK5hz1Avs3zgHteNqfhHgowMNgSbv7gk3LePxKvTm1\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1erfq8SCXMhXW1JZe3n4HVUXqF22dVSLm4\\"},\\"seedFingerPrint\\":\\"2263e19b\\",\\"label\\":\\"test2\\",\\"type\\":\\"mnemonic\\"}]","seedPhrases":"{\\"5fd091e1\\":{\\"iv\\":\\"9c70b0a3f7aeefd5d73208f0\\",\\"salt\\":\\"4f571e4cfa08d48bd324a0905d964696b715eb23a6845aad499531d4619a89f3\\",\\"data\\":\\"135032f8496ab47cde9df5ea8592ef1058f82a5685fa6a5f9f0431216dedb52533cad4cf62c487eb7422273e3b28622207fd60cc61578f5d808e79113a88fee1ceba1f716bd7405cfc3436e9679fd1bdfa7fd2db7024f0ca65d7c6cc99f7a50f6fe7ecccb801382ffee890e631d6e674bafd12eec8788f332c3c2a3381bc932046ea3f980c0ed6fb85e70560baf5788b4857dd9b1c44240b9b16f8e794a6cbcc2d8de26bbfbd03cc\\"},\\"fa3f3982\\":{\\"iv\\":\\"ee844e48b9166d67411f74c3\\",\\"salt\\":\\"ada9d0a3e82581edeaee4470cd76aeb5484f0b447d92b412ec7c0adb457f493d\\",\\"data\\":\\"60b12fef59cfa410c074d628934c27ca092608e60ab1d8132b205d71a0f2761812207fa3548bdbebf7b2b971dc738d1aad7d06b465e5909d4ec775616cf2e2b7f24c6a1226a1ad34fa74310710bcec42bc42d7e73be4fdc4d58242aa365d8759691dfe800c54905586c122c24a1821e39b58f8375c9daa631e9d78030ad0d6805b6059dafffe3ff0bbe5ab5f42ea4b84e669d14ccabec80ecdde5e60a79266422ef64d7603c34bb73212\\"},\\"2263e19b\\":{\\"iv\\":\\"058a3553f5e2f1abbd0363f2\\",\\"salt\\":\\"399419874d06ec69ec9b8ca761772ed5400961f70139a31edaa95da2cd499990\\",\\"data\\":\\"b6816f2768d99e0dfc9565df1f1ec87ef1299ce00a843c111ef74db0ced475065e369b5b5f36baf1652c7b029f3afc40808ba85b47e1910b0e3b38c523c91d1914a3fb6099e752600d15217f652dc91d8d9be013da5557bcf539924429f82a6567dbe401c0452c277fb41ff0c438926aad7b6c48d388a0ab5ee1f905b28d79ff1f3af49b1749a08043025f508f4035e972f6ae11998afd462218\\"}}"}',
  "persist:root": "{}",
};

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("<RestoreBackupFile />", () => {
  it("shows error for wrong backup file format", async () => {
    const {
      result: { current: restoreBackup },
    } = renderHook(() => useRestoreBackup(), { store });

    await expect(restoreBackup({ invalid: "backup" }, "password", {} as any)).rejects.toThrow(
      "Invalid backup file."
    );
  });

  describe("v1 backups", () => {
    it("restores from a v1 backup file", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        json: () => Promise.resolve({ type: "user", revealed: false }),
      } as Response);

      const {
        result: { current: restoreBackup },
      } = renderHook(() => useRestoreBackup(), { store });

      await act(() => restoreBackup(v1Backup, "asdfasdf", {} as any));

      expect(store.getState().accounts.items).toHaveLength(1);

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("throws is the password is invalid", async () => {
      const {
        result: { current: restoreBackup },
      } = renderHook(() => useRestoreBackup(), { store });

      await expect(() => restoreBackup(v1Backup, "password", {} as any)).rejects.toThrow(
        "Error decrypting data: Invalid password"
      );
    });
  });

  describe("v2 backups", () => {
    it("throws is the password is invalid", async () => {
      const {
        result: { current: restoreBackup },
      } = renderHook(() => useRestoreBackup(), { store });

      await expect(() => restoreBackup(v2Backup, "password", {} as any)).rejects.toThrow(
        "Error decrypting data: Invalid password"
      );
    });

    it("restores from a v2 backup file", async () => {
      const persistor = { pause: jest.fn() } as any;

      const {
        result: { current: restoreBackup },
      } = renderHook(() => useRestoreBackup(), { store });

      await act(() => restoreBackup(v2Backup, "123123123", persistor));

      expect(persistor.pause).toHaveBeenCalledTimes(1);
      expect(localStorage.clear).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "persist:accounts",
        v2Backup["persist:accounts"]
      );
      expect(localStorage.setItem).toHaveBeenCalledWith("persist:root", v2Backup["persist:root"]);
    });
  });

  describe("v21 backups", () => {
    it("throws is the password is invalid", async () => {
      const {
        result: { current: restoreBackup },
      } = renderHook(() => useRestoreBackup(), { store });

      await expect(() => restoreBackup(v21Backup, "password", {} as any)).rejects.toThrow(
        "Error decrypting data: Invalid password"
      );
    });

    it("restores from a v21 backup file", async () => {
      const persistor = { pause: jest.fn() } as any;

      const {
        result: { current: restoreBackup },
      } = renderHook(() => useRestoreBackup(), { store });

      await act(() => restoreBackup(v21Backup, "123123123", persistor));

      expect(persistor.pause).toHaveBeenCalledTimes(1);
      expect(localStorage.clear).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "persist:accounts",
        '{"items":"[{\\"type\\":\\"mnemonic\\",\\"curve\\":\\"ed25519\\",\\"pk\\":\\"edpkuRxYBCmrSKLS72hB4eDiG1trmQ7mjBuVXV1HbC9rJ1dM4zdA2Y\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1bho3Q3CXUktUGCx7A5Rfcv5o419iso6vx\\"},\\"derivationPath\\":\\"44\'/1729\'/0\'/0\'\\",\\"derivationPathTemplate\\":\\"44\'/1729\'/?\'/0\'\\",\\"seedFingerPrint\\":\\"e54ef832\\",\\"label\\":\\"Account\\",\\"isVerified\\":true}]","seedPhrases":"{\\"e54ef832\\":{\\"iv\\":\\"2bdc675526692daeee315bf0\\",\\"salt\\":\\"a1fbd322343b83868830454a2fabc1a2425674fcfbfefa576bc990329857773c\\",\\"data\\":\\"15e172fdab4e4f0fb5e22e39ad279962560ea45b9e4e82ca9d6408b960e675e71b267cceee5c85d2c83b7e3f48f6812157421da39c4f7594b5978d0ed97ce3b297f6ec53f117acb6acff16f3e6986fa662f060f6574504a48f13c2667a862032769dad60baa6d7158f71bffa6cfb3f5fb40c164fb580a0b71074ae00e018ea96c3352b9204ad48e873bf5095a759d1cedc3c1df408f24c1a51870f19ae3a682ab68c9f8ea60d3a8f0414\\"}}","secretKeys":"{}","_persist":"{\\"version\\":8,\\"rehydrated\\":true}","current":"\\"tz1bho3Q3CXUktUGCx7A5Rfcv5o419iso6vx\\""}'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith("persist:root", expect.any(String));
    });
  });
});

describe("useDownloadBackupFile", () => {
  MockDate.set("2021-01-01T02:05:01.000Z");

  it("fetches an encrypted state backup", async () => {
    const linkMock: any = { click: jest.fn() };
    localStorage.setItem("persist:accounts", "persist_accounts_content");
    localStorage.setItem("persist:root", "persist_root_content");

    const {
      result: { current: downloadBackupFile },
    } = renderHook(() => useDownloadBackupFile());
    jest.spyOn(document, "createElement").mockReturnValueOnce(linkMock as any);

    await downloadBackupFile("123123123");

    expect(linkMock.download).toEqual("UmamiV2Backup_2021-01-01.json");
    expect(linkMock.click).toHaveBeenCalledTimes(1);

    const href: string = linkMock.href;
    expect(href.startsWith("data:text/json;charset=utf-8,")).toBe(true);
    const data = JSON.parse(decodeURIComponent(href.replace("data:text/json;charset=utf-8,", "")));

    const decrypted = await decrypt(data, "123123123", "V2");

    expect(decrypted).toEqual(
      '{"persist:accounts":"persist_accounts_content","persist:root":"persist_root_content"}'
    );
  });
});
