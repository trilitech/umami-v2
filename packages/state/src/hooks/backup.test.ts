import { mockLedgerAccount, mockMnemonicAccount, mockSocialAccount } from "@umami/core";
import MockDate from "mockdate";

import { useDownloadBackupFile, useRestoreBackup } from "./backup";
import { type UmamiStore, makeStore } from "../store";
import { act, addTestAccounts, renderHook } from "../testUtils";

const invalidBackup = {
  invalid: "backup",
};

const originalWindowLocation = window.location;

beforeAll(() => {
  delete (window as any).location;
  window.location = { reload: jest.fn() } as any;
});
afterAll(() => {
  window.location = originalWindowLocation;
});

const backup = {
  "persist:accounts":
    '{"items":"[{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/0\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3\\"},\\"seedFingerPrint\\":\\"5fd091e1\\",\\"label\\":\\"Restored account 0\\",\\"type\\":\\"mnemonic\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/1\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6\\"},\\"seedFingerPrint\\":\\"5fd091e1\\",\\"label\\":\\"Restored account 1\\",\\"type\\":\\"mnemonic\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/2\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS\\"},\\"seedFingerPrint\\":\\"5fd091e1\\",\\"label\\":\\"Restored account 2\\",\\"type\\":\\"mnemonic\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/3\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkuU8mocvqi2qSB5BunXueNEqV46AU9JzTSno1Njr3h2Waa9kPGh\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1MrbHXHu5dHwWKWsSxP3J57Td4a13T4v21Q\\"},\\"seedFingerPrint\\":\\"5fd091e1\\",\\"label\\":\\"htrthrh\\",\\"type\\":\\"mnemonic\\"},{\\"derivationPath\\":\\"44\'/1729\'/?\'/0\'\\",\\"curve\\":\\"ed25519\\",\\"type\\":\\"ledger\\",\\"pk\\":\\"sppk7ZrrFmeLtGyDchMcGGMv1SDYpNQeexqwem3F3RByWkyWdgAxpy5\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz2FMghcbuooCeh2yL6MnK33ywCDksD8x5Q1\\"},\\"label\\":\\"Bahador\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/4\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkv2YM4m3B3X5hDBQUHXzjwSDuwn8yQBdwXk2QLpwTW7XMbJSunM\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1hdGCexsPWGxbCFsPjqAuuJAP2cumXwMxz\\"},\\"seedFingerPrint\\":\\"5fd091e1\\",\\"label\\":\\"12asd\\",\\"type\\":\\"mnemonic\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/0\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkvWu5C4wjmwKvbZu726N4h7SvqfTRaiamB6z8dTvd1qUnE6YQcP\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1cEY5rPtqLMP3K1Bhs2RLfbCi5dpKvP3jL\\"},\\"seedFingerPrint\\":\\"fa3f3982\\",\\"label\\":\\"test\\",\\"type\\":\\"mnemonic\\"},{\\"curve\\":\\"ed25519\\",\\"derivationPath\\":\\"44\'/1729\'/0\'/0\'\\",\\"derivationPathPattern\\":\\"44\'/1729\'/?\'/0\'\\",\\"pk\\":\\"edpkvJ7tLYQXFK5hz1Avs3zgHteNqfhHgowMNgSbv7gk3LePxKvTm1\\",\\"address\\":{\\"type\\":\\"implicit\\",\\"pkh\\":\\"tz1erfq8SCXMhXW1JZe3n4HVUXqF22dVSLm4\\"},\\"seedFingerPrint\\":\\"2263e19b\\",\\"label\\":\\"test2\\",\\"type\\":\\"mnemonic\\"}]","seedPhrases":"{\\"5fd091e1\\":{\\"iv\\":\\"9c70b0a3f7aeefd5d73208f0\\",\\"salt\\":\\"4f571e4cfa08d48bd324a0905d964696b715eb23a6845aad499531d4619a89f3\\",\\"data\\":\\"135032f8496ab47cde9df5ea8592ef1058f82a5685fa6a5f9f0431216dedb52533cad4cf62c487eb7422273e3b28622207fd60cc61578f5d808e79113a88fee1ceba1f716bd7405cfc3436e9679fd1bdfa7fd2db7024f0ca65d7c6cc99f7a50f6fe7ecccb801382ffee890e631d6e674bafd12eec8788f332c3c2a3381bc932046ea3f980c0ed6fb85e70560baf5788b4857dd9b1c44240b9b16f8e794a6cbcc2d8de26bbfbd03cc\\"},\\"fa3f3982\\":{\\"iv\\":\\"ee844e48b9166d67411f74c3\\",\\"salt\\":\\"ada9d0a3e82581edeaee4470cd76aeb5484f0b447d92b412ec7c0adb457f493d\\",\\"data\\":\\"60b12fef59cfa410c074d628934c27ca092608e60ab1d8132b205d71a0f2761812207fa3548bdbebf7b2b971dc738d1aad7d06b465e5909d4ec775616cf2e2b7f24c6a1226a1ad34fa74310710bcec42bc42d7e73be4fdc4d58242aa365d8759691dfe800c54905586c122c24a1821e39b58f8375c9daa631e9d78030ad0d6805b6059dafffe3ff0bbe5ab5f42ea4b84e669d14ccabec80ecdde5e60a79266422ef64d7603c34bb73212\\"},\\"2263e19b\\":{\\"iv\\":\\"058a3553f5e2f1abbd0363f2\\",\\"salt\\":\\"399419874d06ec69ec9b8ca761772ed5400961f70139a31edaa95da2cd499990\\",\\"data\\":\\"b6816f2768d99e0dfc9565df1f1ec87ef1299ce00a843c111ef74db0ced475065e369b5b5f36baf1652c7b029f3afc40808ba85b47e1910b0e3b38c523c91d1914a3fb6099e752600d15217f652dc91d8d9be013da5557bcf539924429f82a6567dbe401c0452c277fb41ff0c438926aad7b6c48d388a0ab5ee1f905b28d79ff1f3af49b1749a08043025f508f4035e972f6ae11998afd462218\\"}}"}',
  "persist:root": "{}",
  user_requirements_nonce: "123123123",
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

    expect(() => restoreBackup(invalidBackup as any)).toThrow("Invalid backup file.");
  });

  describe("correctly restores backup", () => {
    it("restores from a backup file", () => {
      const {
        result: { current: restoreBackup },
      } = renderHook(() => useRestoreBackup(), { store });

      act(() => restoreBackup(backup));

      expect(localStorage.clear).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "persist:accounts",
        backup["persist:accounts"]
      );
      expect(localStorage.setItem).toHaveBeenCalledWith("persist:root", backup["persist:root"]);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user_requirements_nonce",
        backup["user_requirements_nonce"]
      );
    });
  });
});

describe("useDownloadBackupFile", () => {
  MockDate.set("2025-02-28T02:05:01.000Z");
  const mockAccounts = [
    mockMnemonicAccount(0, { isVerified: true }),
    mockMnemonicAccount(1, { isVerified: false }),
    mockMnemonicAccount(2, { isVerified: true }),
    mockSocialAccount(3),
    mockLedgerAccount(4),
  ];

  let store: UmamiStore;
  beforeEach(() => {
    store = makeStore();
    addTestAccounts(store, mockAccounts);
  });

  it("fetches an encrypted state backup", async () => {
    const linkMock: any = { click: jest.fn() };

    localStorage.setItem("persist:accounts", backup["persist:accounts"]);
    localStorage.setItem("persist:root", backup["persist:root"]);
    localStorage.setItem("user_requirements_nonce", backup["user_requirements_nonce"]);

    const {
      result: { current: downloadBackupFile },
    } = renderHook(() => useDownloadBackupFile(), {
      store,
    });

    jest.spyOn(document, "createElement").mockReturnValueOnce(linkMock as any);

    downloadBackupFile();

    expect(linkMock.download).toEqual("UmamiBackup_2025-02-28.json");
    expect(linkMock.click).toHaveBeenCalledTimes(1);

    const href: string = linkMock.href;
    expect(href.startsWith("data:text/json;charset=utf-8,")).toBe(true);
    const data = JSON.parse(decodeURIComponent(href.replace("data:text/json;charset=utf-8,", "")));

    expect(data).toEqual(backup);
  });
});
