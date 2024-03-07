import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  PartialTezosOperation,
  TezosOperationType,
} from "@airgap/beacon-wallet";
import { useContext } from "react";

import { PermissionRequestModal } from "./PermissionRequestModal";
import { SignPayloadRequestModal } from "./SignPayloadRequestModal";
import { DynamicModalContext } from "../../components/DynamicModal";
import { BeaconSignPage } from "../../components/SendFlow/Beacon/BeaconSignPage";
import { ImplicitAccount } from "../../types/Account";
import { ImplicitOperations } from "../../types/AccountOperations";
import { isValidContractPkh, parseContractPkh, parseImplicitPkh } from "../../types/Address";
import { Operation } from "../../types/Operation";
import { useGetOwnedAccount } from "../hooks/getAccountDataHooks";
import { useSelectedNetwork } from "../hooks/networkHooks";
import { useAsyncActionHandler } from "../hooks/useAsyncActionHandler";
import { estimate } from "../tezos";

/**
 * @returns a function that handles a beacon message and opens a modal with the appropriate content
 *
 * For operation requests it will also try to convert the operation(s) to our {@link Operation} format,
 * estimate the fee and open the BeaconSignPage only if it succeeds
 */
export const useHandleBeaconMessage = () => {
  const { openWith } = useContext(DynamicModalContext);
  const { handleAsyncAction } = useAsyncActionHandler();
  const getAccount = useGetOwnedAccount();
  const network = useSelectedNetwork();

  return (message: BeaconRequestOutputMessage) => {
    void handleAsyncAction(
      async () => {
        let modal;
        switch (message.type) {
          case BeaconMessageType.PermissionRequest: {
            modal = <PermissionRequestModal request={message} />;
            break;
          }
          case BeaconMessageType.SignPayloadRequest: {
            modal = <SignPayloadRequestModal request={message} />;
            break;
          }
          case BeaconMessageType.OperationRequest: {
            const signer = getAccount(message.sourceAddress) as ImplicitAccount;
            const operation = toAccountOperations(message.operationDetails, signer);
            const fee = await estimate(operation, network);
            modal = <BeaconSignPage fee={fee} message={message} operation={operation} />;
            break;
          }
          default:
            // TODO: Open a modal with an unknown operation instead
            throw new Error(`Unknown Beacon message type: ${message.type}`);
        }

        return openWith(modal);
      },
      error => ({
        description: `Error while processing Beacon request: ${error.message}`,
      })
    );
  };
};

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
  switch (partialOperation.kind) {
    case TezosOperationType.TRANSACTION: {
      const { destination, amount, parameters } = partialOperation;
      const isContractCall = isValidContractPkh(destination) && parameters;
      if (isContractCall) {
        return {
          type: "contract_call",
          amount,
          contract: parseContractPkh(destination),
          entrypoint: parameters.entrypoint,
          args: parameters.value,
        };
      } else {
        return {
          type: "tez",
          amount,
          recipient: parseImplicitPkh(partialOperation.destination),
        };
      }
    }
    case TezosOperationType.DELEGATION: {
      const { delegate } = partialOperation;

      if (delegate) {
        return {
          type: "delegation",
          sender: signer.address,
          recipient: parseImplicitPkh(delegate),
        };
      } else {
        return { type: "undelegation", sender: signer.address };
      }
    }
    default:
      throw new Error(`Unsupported operation kind: ${partialOperation.kind}`);
  }
};
