import { type Network } from "@umami/tezos";
import { z } from "zod";

export const getNetworkValidationScheme = (availableNetworks: Network[], network?: Network) =>
  z.object({
    name: network
      ? z.string().optional()
      : z
          .string()
          .min(1, "Name is required")
          .refine(name => !availableNetworks.find(n => n.name === name), {
            message: "Network with this name already exists",
          }),
    rpcUrl: z.string().min(1, "RPC URL is required").url("Enter a valid RPC URL"),
    tzktApiUrl: z.string().min(1, "Tzkt API URL is required").url("Enter a valid Tzkt API URL"),
    tzktExplorerUrl: z
      .string()
      .min(1, "Tzkt Explorer URL is required")
      .url("Enter a valid Tzkt Explorer URL"),
    buyTezUrl: z.string().url("Enter a valid Buy Tez URL").or(z.literal("")),
  });
