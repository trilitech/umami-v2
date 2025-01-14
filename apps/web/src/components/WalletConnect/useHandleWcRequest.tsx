import { type SigningType } from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import {
  type ImplicitAccount,
  estimate,
  getSigningTypeFromPayload,
  toAccountOperations,
} from "@umami/core";
import {
  useAsyncActionHandler,
  useFindNetwork,
  useGetImplicitAccount,
  useGetOwnedAccountSafe,
  walletKit,
} from "@umami/state";
import { WalletConnectError } from "@umami/utils";
import { formatJsonRpcError, formatJsonRpcResult } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes, type SignClientTypes, type Verify } from "@walletconnect/types";
import { type SdkErrorKey, getSdkError } from "@walletconnect/utils";

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
 * estimate the fee and open the BeaconSignPage only if it succeeds
 */
export const useHandleWcRequest = () => {
  const { openWith } = useDynamicModalContext();
  const { handleAsyncActionUnsafe } = useAsyncActionHandler();
  const getAccount = useGetOwnedAccountSafe();
  const getImplicitAccount = useGetImplicitAccount();
  const findNetwork = useFindNetwork();
  const toast = useToast();

  return async (
    event: {
      verifyContext: Verify.Context;
    } & SignClientTypes.BaseEventArgs<{
      request: {
        method: string;
        params: any;
        expiryTimestamp?: number;
      };
      chainId: string;
    }>,
    session: SessionTypes.Struct
  ) => {
    await handleAsyncActionUnsafe(async () => {
      const { id, topic, params } = event;
      const { request, chainId } = params;

      let modal;
      let onClose;

      switch (request.method) {
        case "tezos_getAccounts": {
          const wcPeers = walletKit.getActiveSessions();
          if (!(topic in wcPeers)) {
            throw new WalletConnectError(`Unknown session ${topic}`, "UNAUTHORIZED_EVENT", null);
          }
          const session = wcPeers[topic];
          const accountPkh = session.namespaces.tezos.accounts[0].split(":")[2];
          const signer = getImplicitAccount(accountPkh);
          const publicKey = signer.pk;
          const response = formatJsonRpcResult(id, [
            {
              algo: "ed25519", // the only supported curve
              address: accountPkh,
              pubkey: publicKey,
            },
          ]);
          await walletKit.respondSessionRequest({ topic, response });

          toast({
            description: "Successfully provided the requested account data",
            status: "success",
          });
          return;
        }

        case "tezos_sign": {
          if (!request.params.account) {
            throw new WalletConnectError("Missing account in request", "INVALID_EVENT", session);
          }
          const signer = getImplicitAccount(request.params.account);
          const network = findNetwork(chainId.split(":")[1]);
          if (!network) {
            throw new WalletConnectError(
              `Unsupported network ${chainId}`,
              "UNSUPPORTED_CHAINS",
              session
            );
          }

          const signingType: SigningType = getSigningTypeFromPayload(request.params.payload);
          const signPayloadProps: SignPayloadProps = {
            appName: session.peer.metadata.name,
            appIcon: session.peer.metadata.icons[0],
            payload: request.params.payload,
            isScam: event.verifyContext.verified.isScam,
            validationStatus: event.verifyContext.verified.validation,
            signer,
            signingType,
            requestId: { sdkType: "walletconnect", id: id, topic },
          };

          modal = <SignPayloadRequestModal opts={signPayloadProps} />;
          onClose = () => {
            const sdkErrorKey: SdkErrorKey = "USER_REJECTED";
            console.info("WC request rejected by user", sdkErrorKey, event);
            // dApp is waiting so we need to notify it
            const response = formatJsonRpcError(id, getSdkError(sdkErrorKey).message);
            void walletKit.respondSessionRequest({ topic, response });
          };
          return openWith(modal, { onClose });
        }

        case "tezos_send": {
          if (!request.params.account) {
            throw new WalletConnectError("Missing account in request", "INVALID_EVENT", session);
          }
          const signer = getAccount(request.params.account);
          if (!signer) {
            throw new WalletConnectError(
              `Unknown account, no signer: ${request.params.account}`,
              "UNAUTHORIZED_EVENT",
              session
            );
          }
          const operation = toAccountOperations(
            request.params.operations,
            signer as ImplicitAccount
          );
          const network = findNetwork(chainId.split(":")[1]);
          if (!network) {
            throw new WalletConnectError(
              `Unsupported network ${chainId}`,
              "UNSUPPORTED_CHAINS",
              session
            );
          }
          const estimatedOperations = await estimate(operation, network);
          const headerProps: SignHeaderProps = {
            network,
            appName: session.peer.metadata.name,
            appIcon: session.peer.metadata.icons[0],
            isScam: event.verifyContext.verified.isScam,
            validationStatus: event.verifyContext.verified.validation,
            requestId: { sdkType: "walletconnect", id: id, topic },
          };
          const signProps: SdkSignPageProps = {
            headerProps: headerProps,
            operation: estimatedOperations,
          };

          if (operation.operations.length === 1) {
            modal = <SingleSignPage {...signProps} />;
          } else {
            modal = <BatchSignPage {...signProps} {...event.params.request.params} />;
          }
          onClose = () => {
            throw new WalletConnectError("Rejected by user", "USER_REJECTED", session);
          };

          return openWith(modal, { onClose });
        }
        default:
          throw new WalletConnectError(
            `Unsupported method ${request.method}`,
            "WC_METHOD_UNSUPPORTED",
            session
          );
      }
    });
  };
};
