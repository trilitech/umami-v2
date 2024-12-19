import { SigningType } from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type ImplicitAccount, estimate, toAccountOperations } from "@umami/core";
import {
  useAsyncActionHandler,
  useFindNetwork,
  useGetImplicitAccount,
  useGetOwnedAccountSafe,
  walletKit,
} from "@umami/state";
import { WalletConnectError } from "@umami/utils";
import { formatJsonRpcResult } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes, type SignClientTypes, type Verify } from "@walletconnect/types";

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
            throw new WalletConnectError(
              `Unknown session ${topic}`,
              "UNAUTHORIZED_EVENT",
              null
            );
          }
          const session = wcPeers[topic];
          const accountPkh = session.namespaces.tezos.accounts[0].split(":")[2];
          const signer = getAccount(accountPkh);
          if (!signer) {
            throw new WalletConnectError(
              `Unknown account, no signer: ${accountPkh}`,
              "UNAUTHORIZED_EVENT",
              session
            );
          }
          const response = formatJsonRpcResult(id, [
            {
              algo: "ed25519",
              address: accountPkh,
              pubkey: accountPkh,
            },
          ]);
          await walletKit.respondSessionRequest({ topic, response });

          toast({
            description: "Successfully signed the payload",
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
          const signPayloadProps: SignPayloadProps = {
            appName: session.peer.metadata.name,
            appIcon: session.peer.metadata.icons[0],
            payload: request.params.payload,
            signer: signer,
            signingType: SigningType.RAW,
            requestId: { sdkType: "walletconnect", id: id, topic },
          };

          modal = <SignPayloadRequestModal opts={signPayloadProps} />;
          onClose = () => {
            throw new WalletConnectError("Rejected by user", "USER_REJECTED", session);
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
          };
          const signProps: SdkSignPageProps = {
            headerProps: headerProps,
            operation: estimatedOperations,
            requestId: { sdkType: "walletconnect", id: id, topic },
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
