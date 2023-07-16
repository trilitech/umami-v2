import { makeTokenTransferParams } from "./helpers";
import { OpKind, ParamsWithKind, TezosToolkit, WalletParamsWithKind } from "@taquito/taquito";
import { OperationValue } from "../../components/sendForm/types";
import { makeToolkit } from "../../types/ToolkitConfig";
import { FakeToolkitConfig } from "../../types/ToolkitConfig";

export const operationValuesToWalletParams = async (
  operations: OperationValue[],
  toolkit: TezosToolkit
): Promise<WalletParamsWithKind[]> =>
  operationValuesToParams(operations, toolkit) as Promise<WalletParamsWithKind[]>;

export const operationValuesToParams = async (
  operations: OperationValue[],
  toolkit: TezosToolkit
): Promise<ParamsWithKind[]> => {
  const result: ParamsWithKind[] = [];
  const signerPkh = await toolkit.signer.publicKeyHash();

  for (const operation of operations) {
    switch (operation.type) {
      case "tez":
        result.push({
          kind: OpKind.TRANSACTION,
          to: operation.recipient.pkh,
          amount: parseInt(operation.amount),
          parameter: operation.parameter,
          mutez: true,
        });
        break;
      case "delegation":
        result.push({
          kind: OpKind.DELEGATION,
          source: signerPkh,
          delegate: operation.recipient?.pkh,
        });
        break;
      case "fa1.2":
      case "fa2":
        result.push({
          kind: OpKind.TRANSACTION,
          ...makeTokenTransferParams(operation),
        });
        break;
    }
  }

  return result;
};

export const operationValuesToBatchParams = async (
  operations: OperationValue[],
  config: FakeToolkitConfig
): Promise<ParamsWithKind[]> => {
  if (!operations.length) {
    throw new Error("no operations provided");
  }
  const dummySigner = await makeToolkit(config);

  return operationValuesToParams(operations, dummySigner);
};
