import { TezosNetwork } from "@airgap/tezos";
import { get } from "lodash";
import { Token } from "../../types/Token";
import { useAppSelector } from "../store/hooks";

export const useGetToken = (network: TezosNetwork) => {
  const tokens = useAppSelector(s => s.tokens[network]);
  return (contract: string, tokenId: string): Token | undefined => get(tokens, [contract, tokenId]);
};
