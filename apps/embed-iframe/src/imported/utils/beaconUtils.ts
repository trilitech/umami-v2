import { type PartialTezosOperation, TezosOperationType } from "@airgap/beacon-types";
import { type ContractOrigination, type ImplicitAccount, type Operation } from "@umami/core";
import { isValidImplicitPkh, parseImplicitPkh, parsePkh } from "@umami/tezos";

/**
 * Converts a {@link PartialTezosOperation} which comes from Beacon to a {@link Operation}
 *
 * Note: it doesn't supported all of the possible operation types, but only a subset of them.
 *
 * @param partialOperation - the operation to convert
 * @param signer - the {@link Account} that's going to sign the operation
 * @returns a parsed {@link Operation}
 */
export const partialOperationToOperation = (
  partialOperation: PartialTezosOperation,
  signer: ImplicitAccount
): Operation => {
  switch (partialOperation.kind) {
    case TezosOperationType.TRANSACTION: {
      const { destination, amount, parameters } = partialOperation;
      if (parameters) {
        // if the destination is an implicit account then it's a pseudo operation
        if (isValidImplicitPkh(destination)) {
          switch (parameters.entrypoint) {
            case "stake":
              return { type: "stake", amount, sender: parseImplicitPkh(destination) };
            case "unstake":
              return { type: "unstake", amount, sender: parseImplicitPkh(destination) };
            case "finalize_unstake":
              return { type: "finalize_unstake", sender: parseImplicitPkh(destination) };
          }
        }

        return {
          type: "contract_call",
          amount,
          contract: parsePkh(destination),
          entrypoint: parameters.entrypoint,
          args: parameters.value,
        };
      }

      return {
        type: "tez",
        amount,
        recipient: parseImplicitPkh(partialOperation.destination),
      };
    }
    case TezosOperationType.DELEGATION: {
      const { delegate } = partialOperation;

      if (delegate) {
        return {
          type: "delegation",
          sender: signer.address,
          recipient: parseImplicitPkh(delegate),
        };
      }
      return { type: "undelegation", sender: signer.address };
    }
    case TezosOperationType.ORIGINATION: {
      const { script } = partialOperation;
      const { code, storage } = script as unknown as {
        code: ContractOrigination["code"];
        storage: ContractOrigination["storage"];
      };

      return {
        type: "contract_origination",
        sender: signer.address,
        code,
        storage,
      };
    }
    default:
      throw new Error(`Unsupported operation kind: ${partialOperation.kind}`);
  }
};
