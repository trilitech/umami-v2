import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  OperationRequestOutput,
  OperationResponseInput,
  PartialTezosOperation,
  TezosOperationType,
} from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import React from "react";
import SendForm from "../../../components/sendForm";
import { OperationValue } from "../../../components/sendForm/types";
import { useGetAccount } from "../../hooks/accountHooks";
import { walletClient } from "../beacon";
import BeaconErrorPannel from "./pannels/BeaconErrorPannel";
import PermissionRequestPannel from "./pannels/PermissionRequestPannel";
import SignPayloadRequestPannel from "./pannels/SignPayloadRequestPannel";

export const BeaconNotification: React.FC<{
  message: BeaconRequestOutputMessage;
  onSuccess: () => void;
}> = ({ message, onSuccess }) => {
  const getAccount = useGetAccount();
  const toast = useToast();

  switch (message.type) {
    case BeaconMessageType.PermissionRequest: {
      return (
        <PermissionRequestPannel request={message} onSuccess={onSuccess} />
      );
    }
    case BeaconMessageType.SignPayloadRequest: {
      return (
        <SignPayloadRequestPannel request={message} onSuccess={onSuccess} />
      );
    }
    case BeaconMessageType.OperationRequest: {
      const signerAccount = getAccount(message.sourceAddress);
      if (!signerAccount) {
        return (
          <BeaconErrorPannel
            message={`Account not in this wallet ${message.sourceAddress}`}
          />
        );
      }

      try {
        const transfer: OperationValue = buildTransfer(message);

        const handleSuccess = async (hash: string) => {
          const response: OperationResponseInput = {
            type: BeaconMessageType.OperationResponse,
            id: message.id,
            transactionHash: hash,
          };

          try {
            await walletClient.respond(response);
          } catch (error: any) {
            toast({
              title: "Failed to confirm Beacon operation success",
              description: error.message,
            });
          }
        };

        const amount =
          transfer.type === "tez" ? transfer.value.amount : undefined;
        const parameter =
          transfer.type === "tez" ? transfer.value.parameter : undefined;

        return (
          <SendForm
            disabled
            onSuccess={handleSuccess}
            mode={{ type: transfer.type }}
            recipient={transfer.value.recipient}
            sender={transfer.value.sender}
            amount={amount}
            parameter={parameter}
          />
        );
      } catch (error: any) {
        return (
          <BeaconErrorPannel
            message={`Error handling operation request: ${error.message}`}
          />
        );
      }
    }

    default:
      return (
        <BeaconErrorPannel message={`Unsupported request: ${message.type}`} />
      );
  }
};

const beaconToUmamiOperation = (
  operation: PartialTezosOperation,
  sender: string
) => {
  if (operation.kind === TezosOperationType.TRANSACTION) {
    const result: OperationValue = {
      type: "tez",
      value: {
        sender,
        amount: operation.amount,
        recipient: operation.destination,
        parameter: operation.parameters,
      },
    };

    return result;
  }

  if (operation.kind === TezosOperationType.DELEGATION) {
    const result: OperationValue = {
      type: "delegation",
      value: {
        sender,
        recipient: operation.delegate,
      },
    };

    return result;
  }

  throw new Error(`Unsupported operation: ${operation.kind}`);
};

const buildTransfer = (o: OperationRequestOutput) => {
  const { operationDetails } = o;

  if (operationDetails.length === 0) {
    throw new Error("Empty operation details!");
  }

  if (operationDetails.length === 1) {
    const operation = operationDetails[0];
    return beaconToUmamiOperation(operation, o.sourceAddress);
  }

  throw new Error("Batch not supported");
};
