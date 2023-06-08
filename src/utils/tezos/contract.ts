import { MichelsonV1Expression } from "@taquito/rpc";
import { TezosToolkit, TransactionOperation } from "@taquito/taquito";
export type ContractCallParams = {
  contract: string;
  entrypoint: string;
  value: MichelsonV1Expression;
  amount?: number;
};

export const callContract = async (
  params: ContractCallParams,
  singer: TezosToolkit
): Promise<TransactionOperation> => {
  try {
    const res = await singer.contract.transfer({
      to: params.contract,
      amount: params.amount ?? 0,
      parameter: {
        entrypoint: params.entrypoint,
        value: params.value,
      },
    });
    return res;
  } catch (err: any) {
    throw new Error("error calling contract:" + err.message);
  }
};
