import { filterNulls, objectMap } from "../helpers";
import { useAppSelector } from "../store/hooks";
import { makeNft } from "../token/classify/classifyToken";

export const useAllNfts = () => {
  const balances = useAppSelector((s) => s.assets.balances);
  return objectMap(balances, (b) => filterNulls(b.tokens.map(makeNft)));
};
