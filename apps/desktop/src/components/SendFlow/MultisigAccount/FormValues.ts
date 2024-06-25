import { type RawPkh } from "@umami/tezos";

export type FormValues = {
  name: string;
  sender: RawPkh; // Fee payer
  signers: { val: RawPkh }[];
  threshold: number;
};
