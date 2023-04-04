import { NFT } from "../../types/Asset";

type TezMode = { type: "tez" };
type NFTMode = {
  type: "nft";
  data: NFT;
};

type DelegationMode = {
  type: "delegation";
  data?: {
    undelegate: boolean;
  };
};

export type SendFormMode = TezMode | NFTMode | DelegationMode;

export type TransactionValues =
  | (TezMode & {
      values: {
        amount: number;
        sender: string;
        recipient: string;
      };
    })
  | (NFTMode & {
      values: {
        amount: number;
        sender: string;
        recipient: string;
      };
    })
  | (DelegationMode & {
      values: {
        sender: string;
        recipient?: string;
      };
    });
