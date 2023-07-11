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
import { SendFormMode } from "../../../components/sendForm/types";
import { parseImplicitPkh, parsePkh } from "../../../types/Address";
import { Operation } from "../../../types/Operation";
import { useFirstAccount, useGetImplicitAccount } from "../../hooks/accountHooks";
import { walletClient } from "../beacon";
import BeaconErrorPanel from "./pannels/BeaconErrorPanel";
import PermissionRequestPanel from "./pannels/PermissionRequestPanel";
import SignPayloadRequestPanel from "./pannels/SignPayloadRequestPanel";

const SingleTransaction = ({
  transfer,
  onSuccess,
  sender,
}: {
  transfer: Operation;
  onSuccess: (hash: string) => any;
  sender: string;
}) => {
  const amount = transfer.type === "tez" ? transfer.amount : undefined;
  const parameter = transfer.type === "tez" ? transfer.parameter : undefined;

  const mode: SendFormMode = transfer.type === "tez" ? { type: "tez" } : { type: "delegation" };

  // TODO: send directly to recap instead
  return (
    <SendForm
      onSuccess={onSuccess}
      mode={mode}
      recipient={transfer.recipient?.pkh}
      sender={sender}
      amount={amount}
      parameter={parameter}
    />
  );
};

const BatchTransaction = ({
  transfer,
  onSuccess,
  signer,
}: {
  transfer: Operation[];
  onSuccess: (hash: string) => any;
  signer: string;
}) => {
  const account = useFirstAccount();
  const mode: SendFormMode = {
    type: "batch",
    data: {
      batch: transfer,
      signer,
    },
  };

  // TODO: send directly to recap instead
  return (
    <SendForm
      sender={account.address.pkh}
      onSuccess={onSuccess}
      mode={mode}
      recipient={transfer[0].recipient?.pkh}
    />
  );
};

export const BeaconNotification: React.FC<{
  message: BeaconRequestOutputMessage;
  onSuccess: () => void;
}> = ({ message, onSuccess }) => {
  const getAccount = useGetImplicitAccount();
  const toast = useToast();

  switch (message.type) {
    case BeaconMessageType.PermissionRequest: {
      return <PermissionRequestPanel request={message} onSuccess={onSuccess} />;
    }
    case BeaconMessageType.SignPayloadRequest: {
      return <SignPayloadRequestPanel request={message} onSuccess={onSuccess} />;
    }
    case BeaconMessageType.OperationRequest: {
      const signerAccount = getAccount(message.sourceAddress);
      if (!signerAccount) {
        return <BeaconErrorPanel message={`Account not in this wallet ${message.sourceAddress}`} />;
      }

      try {
        const transfers = buildTransfers(message);

        const handleSuccess = async (hash: string) => {
          const response: OperationResponseInput = {
            type: BeaconMessageType.OperationResponse,
            id: message.id,
            transactionHash: hash,
          };

          try {
            await walletClient.respond(response);
          } catch (error) {
            console.warn("Failed to parse Beacon request", error);
            toast({
              title: "Failed to confirm Beacon operation success",
              description: (error as Error).message,
            });
          }
        };

        if (transfers.length === 1) {
          return (
            <SingleTransaction
              sender={signerAccount.address.pkh}
              transfer={transfers[0]}
              onSuccess={handleSuccess}
            />
          );
        }

        return (
          <BatchTransaction
            transfer={transfers}
            onSuccess={handleSuccess}
            signer={signerAccount.address.pkh}
          />
        );
      } catch (error: any) {
        return <BeaconErrorPanel message={`Error handling operation request: ${error.message}`} />;
      }
    }

    default:
      return <BeaconErrorPanel message={`Unsupported request: ${message.type}`} />;
  }
};

const beaconToUmamiOperation = (operation: PartialTezosOperation, sender: string) => {
  if (operation.kind === TezosOperationType.TRANSACTION) {
    const result: Operation = {
      type: "tez",
      amount: operation.amount,
      recipient: parsePkh(operation.destination),
      parameter: operation.parameters,
    };

    return result;
  }

  if (operation.kind === TezosOperationType.DELEGATION) {
    const result: Operation = {
      type: "delegation",
      recipient:
        operation.delegate !== undefined ? parseImplicitPkh(operation.delegate) : undefined,
    };

    return result;
  }

  throw new Error(`Unsupported operation: ${operation.kind}`);
};

const buildTransfers = (o: OperationRequestOutput) => {
  const { operationDetails } = o;

  if (operationDetails.length === 0) {
    throw new Error("Empty operation details!");
  }

  return operationDetails.map(operation => beaconToUmamiOperation(operation, o.sourceAddress));
};
