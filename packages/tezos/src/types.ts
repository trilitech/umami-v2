import { type Curves } from "@taquito/signer";

export type NetworkName = string; // must be unique

export type Network = {
  name: NetworkName;
  rpcUrl: string;
  tzktApiUrl: string;
  tzktExplorerUrl?: string;
  buyTezUrl?: string;
};

export type RawPkh = string;

export type BigmapId = number;

export type PublicKeyPair = {
  pk: string;
  pkh: string;
};

export type ContractAddress = {
  type: "contract";
  pkh: RawPkh;
};

export type ImplicitAddress = {
  type: "implicit";
  pkh: RawPkh;
};

export type Address = ContractAddress | ImplicitAddress;

export type Estimation = {
  storageLimit: number;
  gasLimit: number;
  fee: number;
};
export type ExecuteParams = Estimation;

export type SignerConfig = { network: Network } & (
  | { type: "ledger"; account: { derivationPath: string; curve: Curves } }
  | { type: "mnemonic"; secretKey: string }
  | { type: "secret_key"; secretKey: string }
  | { type: "social"; secretKey: string }
  | { type: "fake"; signer: { pk: string; address: ImplicitAddress } }
);
