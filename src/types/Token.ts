// Didn't find anything equivalent in @airgap/tezos
// TODO add other fields
export type Token = {
  account: { address: string };
  balance: string;
  id: number;
  token: {
    contract: { address: string };
    id: number;
    metadata?: {
      displayUri?: string;
    };
  };
};
