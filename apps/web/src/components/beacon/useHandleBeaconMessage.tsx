import {
  BeaconErrorType,
  BeaconMessageType,
  type Network as BeaconNetwork,
  type BeaconRequestOutputMessage,
} from "@airgap/beacon-wallet";
import { useDynamicModalContext } from "@umami/components";
import { type ImplicitAccount, estimate, toAccountOperations } from "@umami/core";
import {
  WalletClient,
  useAsyncActionHandler,
  useFindNetwork,
  useGetImplicitAccount,
  useGetOwnedAccountSafe,
  useRemoveBeaconPeerBySenderId,
} from "@umami/state";
import { type Network } from "@umami/tezos";
import { BeaconError, getErrorContext } from "@umami/utils";

import { PermissionRequestModal } from "./PermissionRequestModal";
import { SignPayloadRequestModal } from "../common/SignPayloadRequestModal";
import { BatchSignPage } from "../SendFlow/common/BatchSignPage";
import { SingleSignPage } from "../SendFlow/common/SingleSignPage";
import {
  type SdkSignPageProps,
  type SignHeaderProps,
  type SignPayloadProps,
} from "../SendFlow/utils";

/**
 * @returns a function that handles a beacon message and opens a modal with the appropriate content
 *
 * For operation requests it will also try to convert the operation(s) to our {@link Operation} format,
 * estimate the fee and open the SingleSignPage only if it succeeds
 */
export const useHandleBeaconMessage = () => {
  const { openWith } = useDynamicModalContext();
  const { handleAsyncAction } = useAsyncActionHandler();
  const getAccount = useGetOwnedAccountSafe();
  const getImplicitAccount = useGetImplicitAccount();
  const findNetwork = useFindNetwork();
  const removePeer = useRemoveBeaconPeerBySenderId();
  let lastProcessedMessageId: string | null = null;

  // Beacon SDK expects errorData for TRANSACTION_INVALID_ERROR only and as an array of RPC errors
  const respondWithError = async (
    messageId: string,
    errorType: BeaconErrorType,
    errorData?: any
  ) => {
    console.info("[respondWithError]", messageId, errorType, errorData);
    if (messageId !== lastProcessedMessageId) {
      lastProcessedMessageId = messageId;
      console.info("[respondWithError] sending response", errorType);
      await WalletClient.respond({
        id: messageId,
        type: BeaconMessageType.Error,
        errorType,
        errorData,
      });
    } else {
      console.info("[respondWithError] response already sent", errorType);
    }
  };

  // we should confirm that we support the network that the beacon request is coming from
  const checkNetwork = ({
    network: beaconNetwork,
  }: {
    id: string;
    network: BeaconNetwork;
  }): Network => {
    const network = findNetwork(beaconNetwork.type);

    if (!network) {
      throw new BeaconError(
        `Got Beacon request from an unknown network: ${JSON.stringify(
          beaconNetwork
        )}. Please add it to the networks list and retry.`,
        BeaconErrorType.NETWORK_NOT_SUPPORTED
      );
    }

    return network;
  };

  return (message: BeaconRequestOutputMessage) => {
    void handleAsyncAction(
      async () => {
        let modal;
        let onClose;

        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (message.type) {
          case BeaconMessageType.PermissionRequest: {
            checkNetwork(message);
            modal = <PermissionRequestModal request={message} />;
            onClose = async () => {
              await respondWithError(message.id, BeaconErrorType.NOT_GRANTED_ERROR);
              await removePeer(message.senderId);
            };
            break;
          }
          case BeaconMessageType.SignPayloadRequest: {
            const signer = getImplicitAccount(message.sourceAddress);
            const signPayloadProps: SignPayloadProps = {
              appName: message.appMetadata.name,
              appIcon: message.appMetadata.icon,
              payload: message.payload,
              signer: signer,
              signingType: message.signingType,
              requestId: { sdkType: "beacon", id: message.id },
            };
            modal = <SignPayloadRequestModal opts={signPayloadProps} />;
            onClose = async () => {
              await respondWithError(message.id, BeaconErrorType.ABORTED_ERROR);
            };
            break;
          }
          case BeaconMessageType.OperationRequest: {
            const network = checkNetwork(message);
            const signer = getAccount(message.sourceAddress);
            if (!signer) {
              throw new BeaconError(
                `Unknown account: ${message.sourceAddress}`,
                BeaconErrorType.NO_PRIVATE_KEY_FOUND_ERROR
              );
            }

            const operation = toAccountOperations(
              message.operationDetails,
              signer as ImplicitAccount
            );
            const estimatedOperations = await estimate(operation, network);
            const headerProps: SignHeaderProps = {
              network: network,
              appName: message.appMetadata.name,
              appIcon: message.appMetadata.icon,
              requestId: { sdkType: "beacon", id: message.id },
            };
            const signProps: SdkSignPageProps = {
              headerProps: headerProps,
              operation: estimatedOperations,
            };

            if (operation.operations.length === 1) {
              modal = <SingleSignPage {...signProps} />;
            } else {
              modal = <BatchSignPage {...signProps} {...message.operationDetails} />;
            }
            onClose = () => respondWithError(message.id, BeaconErrorType.ABORTED_ERROR);

            break;
          }
          default: {
            // TODO: Open a modal with an unknown operation instead
            throw new BeaconError(
              `Unknown Beacon message type: ${message.type}`,
              BeaconErrorType.UNKNOWN_ERROR
            );
          }
        }

        return openWith(modal, { onClose });
      },
      (error: any) => {
        const context = getErrorContext(error);
        const errorType = error.errorType || BeaconErrorType.UNKNOWN_ERROR;

        void respondWithError(message.id, errorType);
        return { description: `Error while processing Beacon request: ${context.description}` };
      }
    );
  };
};
