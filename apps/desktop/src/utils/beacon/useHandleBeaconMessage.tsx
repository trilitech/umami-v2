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
  useGetOwnedAccountSafe,
  useRemovePeerBySenderId,
} from "@umami/state";
import { type Network } from "@umami/tezos";

import { PermissionRequestModal } from "./PermissionRequestModal";
import { SignPayloadRequestModal } from "./SignPayloadRequestModal";
import { BatchSignPage } from "../../components/SendFlow/Beacon/BatchSignPage";
import { BeaconSignPage } from "../../components/SendFlow/Beacon/BeaconSignPage";

/**
 * @returns a function that handles a beacon message and opens a modal with the appropriate content
 *
 * For operation requests it will also try to convert the operation(s) to our {@link Operation} format,
 * estimate the fee and open the BeaconSignPage only if it succeeds
 */
export const useHandleBeaconMessage = () => {
  const { openWith } = useDynamicModalContext();
  const { handleAsyncAction } = useAsyncActionHandler();
  const getAccount = useGetOwnedAccountSafe();
  const findNetwork = useFindNetwork();
  const removePeer = useRemovePeerBySenderId();

  // we should confirm that we support the network that the beacon request is coming from
  const checkNetwork = ({
    id: messageId,
    network: beaconNetwork,
  }: {
    id: string;
    network: BeaconNetwork;
  }): Network => {
    const network = findNetwork(beaconNetwork.type);

    if (!network) {
      void WalletClient.respond({
        id: messageId,
        type: BeaconMessageType.Error,
        errorType: BeaconErrorType.NETWORK_NOT_SUPPORTED,
      });
      throw new Error(
        `Got Beacon request from an unknown network: ${JSON.stringify(
          beaconNetwork
        )}. Please add it to the networks list and retry.`
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
              await WalletClient.respond({
                id: message.id,
                type: BeaconMessageType.Error,
                errorType: BeaconErrorType.NOT_GRANTED_ERROR,
              });
              await removePeer(message.senderId);
            };
            break;
          }
          case BeaconMessageType.SignPayloadRequest: {
            modal = <SignPayloadRequestModal request={message} />;
            onClose = async () => {
              await WalletClient.respond({
                id: message.id,
                type: BeaconMessageType.Error,
                errorType: BeaconErrorType.ABORTED_ERROR,
              });
              await removePeer(message.senderId);
            };
            break;
          }
          case BeaconMessageType.OperationRequest: {
            const network = checkNetwork(message);
            const signer = getAccount(message.sourceAddress);
            if (!signer) {
              void WalletClient.respond({
                id: message.id,
                type: BeaconMessageType.Error,
                errorType: BeaconErrorType.NO_PRIVATE_KEY_FOUND_ERROR,
              });
              throw new Error(`Unknown account: ${message.sourceAddress}`);
            }
            const operation = toAccountOperations(
              message.operationDetails,
              signer as ImplicitAccount
            );
            const estimatedOperations = await estimate(operation, network);

            if (operation.operations.length === 1) {
              modal = <BeaconSignPage message={message} operation={estimatedOperations} />;
            } else {
              modal = <BatchSignPage message={message} operation={estimatedOperations} />;
            }
            onClose = () =>
              WalletClient.respond({
                id: message.id,
                type: BeaconMessageType.Error,
                errorType: BeaconErrorType.ABORTED_ERROR,
              });

            break;
          }
          default: {
            // TODO: Open a modal with an unknown operation instead

            void WalletClient.respond({
              id: message.id,
              type: BeaconMessageType.Error,
              errorType: BeaconErrorType.UNKNOWN_ERROR,
            });

            throw new Error(`Unknown Beacon message type: ${message.type}`);
          }
        }

        return openWith(modal, { onClose });
      },
      error => ({
        description: `Error while processing Beacon request: ${error.message}`,
      })
    );
  };
};
