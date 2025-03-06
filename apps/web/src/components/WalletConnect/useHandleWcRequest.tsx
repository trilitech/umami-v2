import { type SigningType } from "@airgap/beacon-wallet";
import { useDynamicModalContext } from "@umami/components";
import {
  type ImplicitAccount,
  estimate,
  getSigningTypeFromPayload,
  toAccountOperations,
} from "@umami/core";
import {
  WcScenarioType,
  useAsyncActionHandler,
  useFindNetwork,
  useGetImplicitAccount,
  useGetOwnedAccountSafe,
  useValidateWcRequest,
  walletKit,
} from "@umami/state";
import { WalletConnectError, WcErrorCode, useCustomToast } from "@umami/utils";
import { formatJsonRpcError, formatJsonRpcResult } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes, type SignClientTypes, type Verify } from "@walletconnect/types";

import { SignPayloadRequestModal } from "../common/SignPayloadRequestModal";
import { SingleSignPage } from "../SendFlow/common/RequestSignPage";
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
  const { openWith, goBack } = useDynamicModalContext();
  const { handleAsyncActionUnsafe } = useAsyncActionHandler();
  const validateWcRequest = useValidateWcRequest();
  const getAccount = useGetOwnedAccountSafe();
  const getImplicitAccount = useGetImplicitAccount();
  const findNetwork = useFindNetwork();
  const toast = useCustomToast();

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

      const handleUserRejected = () => {
        if (validateWcRequest("request", id, WcScenarioType.REJECT, goBack)) {
          // dApp is waiting so we need to notify it
          const response = formatJsonRpcError(id, {
            code: WcErrorCode.USER_REJECTED,
            message: "User rejected the request",
          });
          console.info("WC request rejected by user", event, response);
          void walletKit.respondSessionRequest({ topic, response });
        }
      };

      switch (request.method) {
        case "tezos_getAccounts": {
          const wcPeers = walletKit.getActiveSessions();
          if (!(topic in wcPeers)) {
            throw new WalletConnectError(
              `Unknown session ${topic}`,
              WcErrorCode.SESSION_NOT_FOUND,
              null
            );
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
            throw new WalletConnectError(
              "Missing account in request",
              WcErrorCode.MISSING_ACCOUNT_IN_REQUEST,
              session
            );
          }
          const signer = getImplicitAccount(request.params.account);
          const network = findNetwork(chainId.split(":")[1]);
          if (!network) {
            throw new WalletConnectError(
              `Unsupported network ${chainId}`,
              WcErrorCode.UNSUPPORTED_CHAINS,
              session,
              chainId
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
            handleUserRejected();
          };
          return openWith(modal, { onClose });
        }

        case "tezos_send": {
          if (!request.params.account) {
            throw new WalletConnectError(
              "Missing account in request",
              WcErrorCode.MISSING_ACCOUNT_IN_REQUEST,
              session
            );
          }
          const signer = getAccount(request.params.account);
          if (!signer) {
            throw new WalletConnectError(
              `Unknown account, no signer: ${request.params.account}`,
              WcErrorCode.INTERNAL_SIGNER_IS_MISSING,
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
              WcErrorCode.UNSUPPORTED_CHAINS,
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

          modal = <SingleSignPage {...signProps} />;

          onClose = () => {
            handleUserRejected();
          };

          return openWith(modal, { onClose });
        }
        default:
          throw new WalletConnectError(
            `Unsupported method ${request.method}`,
            WcErrorCode.METHOD_UNSUPPORTED,
            session,
            request.method
          );
      }
    });
  };
};
