import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  OperationRequestOutput,
  OperationResponseInput,
  PartialTezosOperation,
  TezosOperationType,
} from "@airgap/beacon-wallet";
import { Box, useToast } from "@chakra-ui/react";
import React from "react";
import { ImplicitOperations } from "../../../types/AccountOperations";
import { isValidContractPkh, parseContractPkh, parseImplicitPkh } from "../../../types/Address";
import { Operation } from "../../../types/Operation";
import { useGetImplicitAccountSafe } from "../../hooks/getAccountDataHooks";
import { walletClient } from "../beacon";
import { PermissionRequestPanel } from "./panels/PermissionRequestPanel";
import { SignPayloadRequestPanel } from "./panels/SignPayloadRequestPanel";
import { BeaconSignPage } from "../../../components/SendFlow/Beacon/BeaconSignPage";
import { ImplicitAccount } from "../../../types/Account";

export const BeaconNotification: React.FC<{
  message: BeaconRequestOutputMessage;
  onClose: () => void;
}> = ({ message, onClose }) => {
  const getAccount = useGetImplicitAccountSafe();
  const toast = useToast();

  switch (message.type) {
    case BeaconMessageType.PermissionRequest: {
      return <PermissionRequestPanel onSuccess={onClose} request={message} />;
    }
    case BeaconMessageType.SignPayloadRequest: {
      return <SignPayloadRequestPanel onSuccess={onClose} request={message} />;
    }
    case BeaconMessageType.OperationRequest: {
      const signer = getAccount(message.sourceAddress);
      if (!signer) {
        return <Box>Account not in this wallet {message.sourceAddress}</Box>;
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
        return <Box>Error handling operation request: {error.message}</Box>;
      }
    }

    default:
      return <div>Unsupported request: {message.type}</div>;
  }
};

const partialOperationToOperation = (
  partialOperation: PartialTezosOperation,
  signer: ImplicitAccount
): Operation | null => {
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
      return null;
  }
};

const toOperation = (
  { operationDetails }: OperationRequestOutput,
  signer: ImplicitAccount
): ImplicitOperations => {
  if (operationDetails.length === 0) {
    throw new Error("Empty operation details!");
  }

  if (operationDetails.length > 1) {
    throw new Error("Batch operation is not supported");
  }

  const partialOperation = operationDetails[0];

  const operation = partialOperationToOperation(operationDetails[0], signer);
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
