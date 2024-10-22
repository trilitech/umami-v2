import { useToast } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type ImplicitAccount, estimate, toAccountOperations } from "@umami/core";
import {
  useAsyncActionHandler,
  useFindNetwork,
  useGetOwnedAccountSafe,
  walletKit,
} from "@umami/state";
import { formatJsonRpcError } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes, type SignClientTypes, type Verify } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";

import { BatchSignPage } from "../SendFlow/common/BatchSignPage";
import { SingleSignPage } from "../SendFlow/common/SingleSignPage";
import { type SdkSignPageProps, type SignHeaderProps } from "../SendFlow/utils";

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
    await handleAsyncActionUnsafe(
      async () => {
        const { id, topic, params } = event;
        const { request, chainId } = params;

        let modal;
        let onClose;

        switch (request.method) {
          case "tezos_getAccounts": {
            const response = formatJsonRpcError(id, getSdkError("INVALID_METHOD").message);
            await walletKit.respondSessionRequest({ topic, response });
            return;
          }

          case "tezos_sign": {
            // onClose = async () => {
            //   const response = formatJsonRpcError(id, getSdkError("USER_REJECTED").message);
            //   await walletKit.respondSessionRequest({ topic, response });
            // };
            // return openWith(<SignPayloadRequestModal request={"FIXME"} />, { onClose });
            const response = formatJsonRpcError(id, getSdkError("INVALID_METHOD").message);
            await walletKit.respondSessionRequest({ topic, response });
            return;
          }

          case "tezos_send": {
            if (!request.params.account) {
              throw new Error("Missing account in request");
            }
            const signer = getAccount(request.params.account);
            if (!signer) {
              throw new Error(`Unknown account, no signer: ${request.params.account}`);
            }
            const operation = toAccountOperations(
              request.params.operations,
              signer as ImplicitAccount
            );
            const network = findNetwork(chainId.split(":")[1]);
            if (!network) {
              const response = formatJsonRpcError(id, getSdkError("INVALID_EVENT").message);
              await walletKit.respondSessionRequest({ topic, response });
              toast({ description: `Unsupported network: ${chainId}`, status: "error" });
              return;
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
            onClose = async () => {
              const response = formatJsonRpcError(id, getSdkError("USER_REJECTED").message);
              await walletKit.respondSessionRequest({ topic, response });
            };

            return openWith(modal, { onClose });
          }
          default:
            throw new Error(`Unsupported method ${request.method}`);
        }
      }
      // error => ({
      //   description: `Error while processing WalletConnect request: ${error.message}`,
      // })
    );
  };
};
