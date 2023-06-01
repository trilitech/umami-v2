import { MichelsonV1Expression } from "@taquito/rpc";
import { Parser } from "@taquito/michel-codec";
import { makeToolkitWithSigner } from "./helpers";
import { TezosNetwork } from "@airgap/tezos";
import { SignerType } from "../../types/SignerConfig";
import { TransactionOperation } from "@taquito/taquito";

export type ContractCallParams = {
  contract: string;
  entrypoint: string;
  payload: string; // the Michelson payload for the given entrypoint
  amount?: number;
};

export const callContract = async (
  params: ContractCallParams,
  sk: string,
  network: TezosNetwork
): Promise<TransactionOperation> => {
  try {
    const Tezos = await makeToolkitWithSigner({
      type: SignerType.SK,
      network,
      sk,
    });
    const args = parseMichelineExpression(params.payload);
    const res = await Tezos.contract.transfer({
      to: params.contract,
      amount: params.amount ?? 0,
      parameter: {
        entrypoint: params.entrypoint,
        value: args,
      },
    });
    return res;
  } catch (err: any) {
    throw new Error("error calling contract:" + err.message);
  }
};

// Parse michelson code to JSON-encoded Michelson AST.
// e.g.) "(Pair 1 3)"" => {"prim":"Pair","args":[{"int":"3"},{"int":"3"}]}
export const parseMichelineExpression = (
  code: string
): MichelsonV1Expression => {
  const p = new Parser();
  const ast = p.parseMichelineExpression(code);
  if (!ast) {
    throw new Error("Error parsing michelson code");
  }
  return ast;
};
