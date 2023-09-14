import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  OperationRequestOutput,
  OperationResponseInput,
  TezosOperationType,
} from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import React from "react";
import { ImplicitOperations } from "../../../components/sendForm/types";
import {
  isValidContractPkh,
  parseContractPkh,
  parseImplicitPkh,
  parsePkh,
} from "../../../types/Address";
import { Operation } from "../../../types/Operation";
import { useGetImplicitAccountSafe } from "../../hooks/accountHooks";
import { walletClient } from "../beacon";
import BeaconErrorPanel from "./panels/BeaconErrorPanel";
import PermissionRequestPanel from "./panels/PermissionRequestPanel";
import SignPayloadRequestPanel from "./panels/SignPayloadRequestPanel";
import BeaconSignPage from "../../../components/SendFlow/Beacon/BeaconSignPage";
import { ImplicitAccount } from "../../../types/Account";

export const BeaconNotification: React.FC<{
  message: BeaconRequestOutputMessage;
  onClose: () => void;
}> = ({ message, onClose }) => {
  const getAccount = useGetImplicitAccountSafe();
  const toast = useToast();

  switch (message.type) {
    case BeaconMessageType.PermissionRequest: {
      return <PermissionRequestPanel request={message} onSuccess={onClose} />;
    }
    case BeaconMessageType.SignPayloadRequest: {
      return <SignPayloadRequestPanel request={message} onSuccess={onClose} />;
    }
    case BeaconMessageType.OperationRequest: {
      const signer = getAccount(message.sourceAddress);
      if (!signer) {
        return <BeaconErrorPanel message={`Account not in this wallet ${message.sourceAddress}`} />;
      }

      try {
        // Beacon operation is a single operation that is one of the following:
        // tez transfer, contract call, delegation or undelegation
        const beaconOperation = toOperation(message, signer);

        const handleSuccess = async (hash: string) => {
          const response: OperationResponseInput = {
            type: BeaconMessageType.OperationResponse,
            id: message.id,
            transactionHash: hash,
          };
          try {
            await walletClient.respond(response);
          } catch (error: any) {
            console.warn("Failed to parse Beacon request", error);
            toast({
              title: "Failed to confirm Beacon operation success",
              description: error.message,
            });
          } finally {
            onClose();
          }
        };

        return <BeaconSignPage onBeaconSuccess={handleSuccess} operation={beaconOperation} />;
      } catch (error: any) {
        return <BeaconErrorPanel message={`Error handling operation request: ${error.message}`} />;
      }
    }

    default:
      return <BeaconErrorPanel message={`Unsupported request: ${message.type}`} />;
  }
};

const toOperation = (
  { operationDetails, sourceAddress }: OperationRequestOutput,
  signer: ImplicitAccount
): ImplicitOperations => {
  if (operationDetails.length === 0) {
    throw new Error("Empty operation details!");
  }

  if (operationDetails.length > 1) {
    throw new Error("Batch operation is not supported");
  }

  const partialOperation = operationDetails[0];

  let operation: Operation | undefined = undefined;

  if (partialOperation.kind === TezosOperationType.TRANSACTION) {
    const { destination, amount, parameters } = partialOperation;
    operation =
      isValidContractPkh(destination) && parameters
        ? {
            type: "contract_call",
            amount,
            contract: parseContractPkh(destination),
            entrypoint: parameters.entrypoint,
            args: parameters.value,
          }
        : {
            type: "tez",
            amount,
            recipient: parseImplicitPkh(partialOperation.destination),
          };
  } else if (partialOperation.kind === TezosOperationType.DELEGATION) {
    const sender = parsePkh(sourceAddress);
    operation = partialOperation.delegate
      ? {
          type: "delegation",
          sender,
          recipient: parseImplicitPkh(partialOperation.delegate),
        }
      : { type: "undelegation", sender };
  }

  if (!operation) {
    throw new Error(`Unsupported operation: ${partialOperation.kind}`);
  }

  return {
    type: "implicit",
    operations: [operation],
    sender: signer,
    signer,
  };
};
