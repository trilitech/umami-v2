import { getChainData } from "@umami/state";
import { useMemo } from "react";

import { TezosLogoIcon } from "../../assets/icons";

interface Props {
  chainId?: string; // namespace + ":" + reference
}

export default function ChainDataMini({ chainId }: Props) {
  const chainData = useMemo(() => getChainData(chainId), [chainId]);

  if (!chainData) {return <></>;}
  return (
    <>
      <div>
        <TezosLogoIcon size="sm" />
        <span style={{ marginLeft: "5px" }}>{chainData.name}</span>
      </div>
    </>
  );
}
