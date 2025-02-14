import { type Network } from "@umami/tezos";

import { getNetworkValidationScheme } from "./validationSchemes";

describe("getNetworkValidationScheme", () => {
  const mockAvailableNetworks: Network[] = [
    {
      name: "Existing Network",
      rpcUrl: "https://example.com",
      tzktApiUrl: "https://api.example.com",
      tzktExplorerUrl: "https://explorer.example.com",
    },
  ];

  it("should validate a correct network input", () => {
    const schema = getNetworkValidationScheme(mockAvailableNetworks);
    const validInput = {
      name: "New Network",
      rpcUrl: "https://rpc.example.com",
      tzktApiUrl: "https://api.tzkt.example.com",
      tzktExplorerUrl: "https://explorer.tzkt.example.com",
      buyTezUrl: "https://buy.example.com",
    };

    const result = schema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject a network with an existing name", () => {
    const schema = getNetworkValidationScheme(mockAvailableNetworks);
    const invalidInput = {
      name: "Existing Network",
      rpcUrl: "https://rpc.example.com",
      tzktApiUrl: "https://api.tzkt.example.com",
      tzktExplorerUrl: "https://explorer.tzkt.example.com",
    };

    const result = schema.safeParse(invalidInput);
    expect(result.success).toBe(false);

    expect(result.error!.issues[0].message).toBe("Network with this name already exists");
  });

  it("should reject invalid URLs", () => {
    const schema = getNetworkValidationScheme(mockAvailableNetworks);
    const invalidInput = {
      name: "Invalid URL Network",
      rpcUrl: "http://insecure.com",
      tzktApiUrl: "not-a-url",
      tzktExplorerUrl: "ftp://invalid-protocol.com",
    };

    const result = schema.safeParse(invalidInput);
    expect(result.success).toBe(false);

    expect(result.error!.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: "RPC URL must be secure and start with 'https://'" }),
        expect.objectContaining({ message: "Enter a valid Tzkt API URL" }),
        expect.objectContaining({
          message: "Enter a valid Tzkt Explorer URL",
        }),
      ])
    );
  });

  it("should allow empty buyTezUrl", () => {
    const schema = getNetworkValidationScheme(mockAvailableNetworks);
    const validInput = {
      name: "No Buy tez URL",
      rpcUrl: "https://rpc.example.com",
      tzktApiUrl: "https://api.tzkt.example.com",
      tzktExplorerUrl: "https://explorer.tzkt.example.com",
      buyTezUrl: "",
    };

    const result = schema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should make name optional when editing an existing network", () => {
    const existingNetwork: Network = {
      name: "Existing Network",
      rpcUrl: "https://rpc.example.com",
      tzktApiUrl: "https://api.tzkt.example.com",
      tzktExplorerUrl: "https://explorer.tzkt.example.com",
    };
    const schema = getNetworkValidationScheme(mockAvailableNetworks, existingNetwork);
    const validInput = {
      rpcUrl: "https://new-rpc.example.com",
      tzktApiUrl: "https://new-api.tzkt.example.com",
      tzktExplorerUrl: "https://new-explorer.tzkt.example.com",
      buyTezUrl: "",
    };

    const result = schema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should require name when adding a new network", () => {
    const schema = getNetworkValidationScheme(mockAvailableNetworks);
    const invalidInput = {
      name: "",
      rpcUrl: "https://rpc.example.com",
      tzktApiUrl: "https://api.tzkt.example.com",
      tzktExplorerUrl: "https://explorer.tzkt.example.com",
      buyTezUrl: "",
    };

    const result = schema.safeParse(invalidInput);
    expect(result.success).toBe(false);

    expect(result.error!.issues[0].message).toBe("Name is required");
  });
});
