import { get } from "lodash";

import { useSelectedNetwork } from "./networkHooks";
import { type RawPkh } from "../../types/Address";
import { type Network } from "../../types/Network";
import { type Token } from "../../types/Token";
import { useAppSelector } from "../redux/hooks";

export type TokenLookup = (contract: RawPkh, tokenId: string) => Token | undefined;

export const useGetToken = (): TokenLookup => {
  const network = useSelectedNetwork();
  const tokens = useAppSelector(s => s.tokens[network.name]);
  return (contract, tokenId) => get(tokens, [contract, tokenId]);
};

export const useGetTokenType = (network: Network) => {
  const tokens = useAppSelector(s => s.tokens[network.name]);
  return (contract: RawPkh): Token["type"] | undefined => {
    if (!(tokens && contract in tokens)) {
      return undefined;
    }
    const contractTokens = tokens[contract];
    const anyTokenId = Object.keys(contractTokens)[0];
    if (!anyTokenId) {
      return undefined;
    }
    return contractTokens[anyTokenId].type;
  };
};
