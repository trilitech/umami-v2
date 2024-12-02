import { type PartialTezosOperation, TezosOperationType } from "@airgap/beacon-wallet";
import { isValidImplicitPkh, parseImplicitPkh, parsePkh } from "@umami/tezos";

import { type ImplicitAccount } from "./Account";
import { type ImplicitOperations } from "./AccountOperations";
import { type ContractOrigination, type Operation } from "./Operation";

/**
 * takes a list of {@link PartialTezosOperation} which come from Beacon
 * and converts them to {@link ImplicitOperations}
 *
 * @param operationDetails - the list of operations to convert
 * @param signer - the {@link Account} that's going to sign the operation
 * @returns
 */
export const toAccountOperations = (
  operationDetails: PartialTezosOperation[],
  signer: ImplicitAccount
): ImplicitOperations => {
  if (operationDetails.length === 0) {
    throw new Error("Empty operation details!");
  }

  const operations = operationDetails.map(operation =>
    partialOperationToOperation(operation, signer)
  );

  return {
    type: "implicit",
    sender: signer,
    operations,
    signer,
  };
};

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
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
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
