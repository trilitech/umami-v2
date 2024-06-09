import { ExecuteParams } from "../utils/tezos";

export const executeParams = (params?: Partial<ExecuteParams>) => ({
  fee: 0,
  gasLimit: 0,
  storageLimit: 0,
  ...params,
});
