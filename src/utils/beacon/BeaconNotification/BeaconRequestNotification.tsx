import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  OperationRequestOutput,
  OperationResponseInput,
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
import { BigNumber } from "bignumber.js";
import { mutezToTez } from "../../format";

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
        const transfer = buildTransfer(message);

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
        return (
          <SendForm
            disabled
            onSuccess={handleSuccess}
            mode={{ type: transfer.type }}
            recipient={transfer.value.recipient}
            sender={transfer.value.sender}
            amount={transfer.value.amount.toString()}
            parameter={transfer.value.parameter}
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

const buildTransfer = (o: OperationRequestOutput) => {
  const { operationDetails } = o;

  if (operationDetails.length === 0) {
    throw new Error("Empty operation details!");
  }

  if (operationDetails.length === 1) {
    const operation = operationDetails[0];

    if (operation.kind !== TezosOperationType.TRANSACTION) {
      throw new Error(`Unsupported operation: ${operation.kind}`);
    }

    const result: OperationValue = {
      type: "tez",
      value: {
        amount: new BigNumber(operation.amount),
        sender: o.sourceAddress,
        recipient: operation.destination,
        parameter: operation.parameters,
      },
    };
    return result;
  }

  throw new Error("Batch not supported");
};
