import { seedPhrase } from "../mocks/seedPhrase";
import { restoreAccounts } from "./restoreAccounts";
import { addressExists, getFingerPrint } from "./tezos";

jest.mock("./tezos");

const addressExistsMock = addressExists as jest.Mock;
const getFingerPrintMock = getFingerPrint as jest.Mock;

const seedFingerPrint = "mockFingerPrint";
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
        seedFingerPrint,
      },
      {
        pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
        pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        sk: "edskRtep9NUmE7JZZdHtB7fxFzvvWRY866eS4DrChgYZrAZZoqCiw8DhGQnhncLxpxucVKBxJML8fUUoAcfjinYNUFnU8NJV8p",
        seedFingerPrint,
      },
      {
        pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
        pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        sk: "edskS9RvEPRrob1SdcWPb66Cp9sRFoYHkVRqsJ8ChVcKfpLpmTUXhM8AA2SGf4tJrVYV6UW1TdBz4NrWrVGHz672iTSUpaVbg7",
        seedFingerPrint,
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
        seedFingerPrint,
      },
    ];

    expect(result).toEqual(expected);
  });
});
