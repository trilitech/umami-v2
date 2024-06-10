import { type RawPkh } from "../../../types/Address";

export type FormValues = {
  name: string;
  sender: RawPkh; // Fee payer
  signers: { val: RawPkh }[];
  threshold: number;
};
