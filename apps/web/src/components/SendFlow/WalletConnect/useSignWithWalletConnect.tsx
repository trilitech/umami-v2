import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { type TezosToolkit } from "@taquito/taquito";
import {
  type Account,
  type ImplicitAccount,
  type SecretKeyAccount,
  estimate,
  executeOperations,
  toAccountOperations,
} from "@umami/core";
import {
  TEZOS_SIGNING_METHODS,
} from "@umami/state";
import { type Network } from "@umami/tezos";
import { type SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";

export async function approveTezosRequest(
  requestEvent: SignClientTypes.EventArguments["session_request"],
  tezosToolkit: TezosToolkit,
  signer: Account,
  network: Network
) {
  const { params, id } = requestEvent;
  const { request } = params;

  console.log("approveTezosRequest", request);

  switch (request.method) {
    case TEZOS_SIGNING_METHODS.TEZOS_GET_ACCOUNTS: {
      console.log("TEZOS_GET_ACCOUNTS");
      return formatJsonRpcResult(id, [{
        algo: (signer as SecretKeyAccount).curve,
        address: signer.address.pkh,
        pubkey: (signer as SecretKeyAccount).pk,
      }]);
    }

    case TEZOS_SIGNING_METHODS.TEZOS_SEND: {
      console.log("TEZOS_SEND");
      try {
        const operation = toAccountOperations(request.params.operations, signer as ImplicitAccount);
        const estimatedOperations = await estimate(operation, network);
        console.log("TEZOS_SEND: executing operation", estimatedOperations);
        const { opHash } = await executeOperations(estimatedOperations, tezosToolkit);
        console.log("TEZOS_SEND: executed operation", request.params.method, operation, opHash);
        return formatJsonRpcResult(id, { hash: opHash });
      } catch (error) {
        if (error instanceof Error) {
          console.error("Tezos_send operation failed with error: ", error.message);
          return formatJsonRpcError(id, error.message);
        } else {
          console.error("Tezos_send operation failed with unknown error: ", error);
          return formatJsonRpcError(id, "TEZOS_SEND failed with unknown error.");
        }
      }
    }

    case TEZOS_SIGNING_METHODS.TEZOS_SIGN: {
      const result = await tezosToolkit.signer.sign(request.params.payload);
      console.log("TEZOS_SIGN", result.prefixSig);
      return formatJsonRpcResult(id, { signature: result.prefixSig });
    }

    default:
      throw new Error(getSdkError("INVALID_METHOD").message);
  }
}

export function rejectTezosRequest(request: SignClientTypes.EventArguments["session_request"]) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError("USER_REJECTED_METHODS").message);
}
