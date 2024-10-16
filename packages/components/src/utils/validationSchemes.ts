import { PROHIBITED_CHARACTERS } from "@umami/state";
import { type Network } from "@umami/tezos";
import { z } from "zod";

const URL_REGEX = new RegExp(
  "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i"
);

const urlScheme = (urlType: string) =>
  z
    .string()
    .min(1, `${urlType} URL is required`)
    .regex(URL_REGEX, `Enter a valid ${urlType} URL`)
    .startsWith("https://", { message: `${urlType} URL must be secure and start with 'https://'` });

export const getNetworkValidationScheme = (availableNetworks: Network[], network?: Network) =>
  z.object({
    name: network
      ? z.string().optional()
      : z
          .string()
          .min(1, "Name is required")
          .max(256, "Name should not exceed 256 characters")
          .refine(name => !PROHIBITED_CHARACTERS.some(char => name.includes(char)), {
            message: "Name contains special character(s)",
          })
          .refine(name => !availableNetworks.find(n => n.name === name), {
            message: "Network with this name already exists",
          }),
    rpcUrl: urlScheme("RPC"),
    tzktApiUrl: urlScheme("Tzkt API"),
    tzktExplorerUrl: urlScheme("Tzkt Explorer"),
    buyTezUrl: urlScheme("Buy Tez").or(z.literal("")),
  });
