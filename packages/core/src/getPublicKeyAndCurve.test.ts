import { makeToolkit } from "@umami/tezos";
import { WalletConnectError } from "@umami/utils";

import { getPublicKeyAndCurve } from "./getPublicKeyAndCurve";

jest.mock("@umami/tezos", () => ({
  ...jest.requireActual("@umami/tezos"),
  makeToolkit: jest.fn(),
}));
const mockGetManagerKey = jest.fn();

describe("getPublicKeyAndCurve", () => {
  beforeEach(() => {
    jest.mocked(makeToolkit).mockImplementation(
      () =>
        ({
          rpc: {
            getManagerKey: mockGetManagerKey,
          },
        }) as any
    );
    jest.clearAllMocks();
  });

  const mockSigner = { address: "tz1..." } as any;
  const mockNetwork = { name: "mainnet" } as any;
  const mockAddress = "tz1...";

  it("returns the public key and curve for ed25519", async () => {
    mockGetManagerKey.mockResolvedValue("edpk123456789");

    const result = await getPublicKeyAndCurve(mockAddress, mockSigner, mockNetwork);

    expect(result).toEqual({
      publicKey: "edpk123456789",
      curve: "ed25519",
    });
  });

  it("returns the public key and curve for secp256k1", async () => {
    mockGetManagerKey.mockResolvedValue("sppk123456789");

    const result = await getPublicKeyAndCurve(mockAddress, mockSigner, mockNetwork);

    expect(result).toEqual({
      publicKey: "sppk123456789",
      curve: "secp256k1",
    });
  });

  it("returns the public key and curve for p-256", async () => {
    mockGetManagerKey.mockResolvedValue("p2pk123456789");

    const result = await getPublicKeyAndCurve(mockAddress, mockSigner, mockNetwork);

    expect(result).toEqual({
      publicKey: "p2pk123456789",
      curve: "p-256",
    });
  });

  it("throws an error if the public key has an unknown prefix", async () => {
    mockGetManagerKey.mockResolvedValue("unknown123456789");

    await expect(getPublicKeyAndCurve(mockAddress, mockSigner, mockNetwork)).rejects.toThrow(
      WalletConnectError
    );

    await expect(getPublicKeyAndCurve(mockAddress, mockSigner, mockNetwork)).rejects.toThrow(
      "Unknown curve for the public key: unknown123456789"
    );
  });

  it("throws an error if the account is not revealed", async () => {
    mockGetManagerKey.mockResolvedValue(null);

    await expect(getPublicKeyAndCurve(mockAddress, mockSigner, mockNetwork)).rejects.toThrow(
      WalletConnectError
    );

    await expect(getPublicKeyAndCurve(mockAddress, mockSigner, mockNetwork)).rejects.toThrow(
      `Signer address is not revealed on the ${mockNetwork.name}`
    );
  });

  it("handles the case where the managerKeyResponse is an object with a key field", async () => {
    mockGetManagerKey.mockResolvedValue({ key: "edpk987654321" });

    const result = await getPublicKeyAndCurve(mockAddress, mockSigner, mockNetwork);

    expect(result).toEqual({
      publicKey: "edpk987654321",
      curve: "ed25519",
    });
  });
});
