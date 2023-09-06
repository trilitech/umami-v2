import { get } from "lodash";
import { RawPkh } from "../../types/Address";
import { TezosNetwork } from "../../types/Network";
import { Token } from "../../types/Token";
import { useAppSelector } from "../redux/hooks";
import { useSelectedNetwork } from "./assetsHooks";

export type TokenLookup = (contract: RawPkh, tokenId: string) => Token | undefined;

export const useGetToken = (): TokenLookup => {
  const network = useSelectedNetwork();
  const tokens = useAppSelector(s => s.tokens[network]);
  return (contract, tokenId) => get(tokens, [contract, tokenId]);
};

export const useGetTokenType = (network: TezosNetwork) => {
  const tokens = useAppSelector(s => s.tokens[network]);
  return (contract: RawPkh): Token["type"] | undefined => {
    if (!(contract in tokens)) {
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
