import { type RawPkh } from "@umami/tezos";

export type Delegate = {
  address: RawPkh;
  name: string;
  stakingBalance: number;
};
