import { type RawPkh } from "./Address";

export type Delegate = {
  address: RawPkh;
  name: string;
  stakingBalance: number;
};
