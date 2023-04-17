import { seedPhrase } from "../mocks/seedPhrase";
import { restoreAccounts, restoreEncryptedAccounts } from "./restoreAccounts";
import { addressExists, getFingerPrint } from "./tezos";
import { Account, AccountType } from "../types/Account";

import "../mocks/mockGetRandomValues";
jest.mock("./tezos");

const addressExistsMock = addressExists as jest.Mock;
const getFingerPrintMock = getFingerPrint as jest.Mock;

beforeEach(() => {
  getFingerPrintMock.mockResolvedValue("mockFingerPrint");
});

describe("restoreAccounts", () => {
  it("should restore exising accounts", async () => {
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreAccounts(seedPhrase);
    const expected = [
      {
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        sk: "edskRicpWcBughiZrP7jDEXse7gMSwa1HG6CEEHZa9y6eBYfpoAii3BqFdemgfpehhbGjxgkPpECxqcCQReGNLsAsh46TwGDEA",
      },
      {
        pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
        pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        sk: "edskRtep9NUmE7JZZdHtB7fxFzvvWRY866eS4DrChgYZrAZZoqCiw8DhGQnhncLxpxucVKBxJML8fUUoAcfjinYNUFnU8NJV8p",
      },
      {
        pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
        pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        sk: "edskS9RvEPRrob1SdcWPb66Cp9sRFoYHkVRqsJ8ChVcKfpLpmTUXhM8AA2SGf4tJrVYV6UW1TdBz4NrWrVGHz672iTSUpaVbg7",
      },
    ];
    expect(result).toEqual(expected);
  });

  it("should restore first account if none exists", async () => {
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreAccounts(seedPhrase);
    const expected = [
      {
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        sk: "edskRicpWcBughiZrP7jDEXse7gMSwa1HG6CEEHZa9y6eBYfpoAii3BqFdemgfpehhbGjxgkPpECxqcCQReGNLsAsh46TwGDEA",
      },
    ];

    expect(result).toEqual(expected);
  });
});

describe("restoreEncryptedAccounts", () => {
  it("should restore exising accounts with label and esk", async () => {
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreEncryptedAccounts(seedPhrase, "password");
    const expected: Account[] = [
      {
        type: AccountType.MNEMONIC,
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        seedFingerPrint: "mockFingerPrint",
        esk: {
          iv: "000000000000000000000000",
          data: "3dc67129131f9e3b28f95848a2304dfd76e4bc317e481f05ef198b65c6f2c548181731a059ee7cda71af575a0a388b52e415da4b8471be78c18bfba1258294009a28667226a340575ff57324e61d93d3193824098fd6250bf073c2653e600253d432e32e6aa970d1d3401c3daa29c738c044",
          salt: "0000000000000000000000000000000000000000000000000000000000000000",
        },
        label: "Account 0",
      },
      {
        type: AccountType.MNEMONIC,
        pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
        pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        seedFingerPrint: "mockFingerPrint",
        esk: {
          iv: "000000000000000000000000",
          data: "3dc671291302983b46d44f50806f6efd5ed0c32f783a210ecc549a5ec2d7fd41666662b028ef46c378f177361d3b886efb0bd84b9a7ab861c0bef0a42c87a81d823871561a90654445c87a5ff839a5ff09092724a8f40f04d65d980652590f41a903a37c69624604ac626a9b3866cbfe4110",
          salt: "0000000000000000000000000000000000000000000000000000000000000000",
        },
        label: "Account 1",
      },
      {
        type: AccountType.MNEMONIC,
        pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
        pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        seedFingerPrint: "mockFingerPrint",
        esk: {
          iv: "000000000000000000000000",
          data: "3dc67129124faf3d3aca484faa3a15f460d7dc0b583b7135fa179f7ad3eafd313b0655926fe10cc378c04d27090a9e44f92ece7a850fc448c6ddcd8b24d0902f80165d637a8e700d5be1741daa2282c73a3c0606bbac6178ea4fa5061a761375f644425dde20e69913904d70c309eddfa18d",
          salt: "0000000000000000000000000000000000000000000000000000000000000000",
        },
        label: "Account 2",
      },
    ];
    expect(result).toEqual(expected);
  });
});
