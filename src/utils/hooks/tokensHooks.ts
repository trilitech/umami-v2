import { get } from "lodash";
import { Token } from "../../types/Token";
import { useAppSelector } from "../store/hooks";
import { useSelectedNetwork } from "./assetsHooks";

export const useGetToken = () => {
  const network = useSelectedNetwork();
  const tokens = useAppSelector(s => s.tokens[network]);
  return (contract: string, tokenId: string): Token | undefined => get(tokens, [contract, tokenId]);
};
