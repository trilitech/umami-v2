import { useDynamicModalContext } from "@umami/components";
import { type ImplicitAccount, estimate, toAccountOperations } from "@umami/core";
import { useAsyncActionHandler, useFindNetwork, useGetOwnedAccountSafe } from "@umami/state";
import { WalletConnectError } from "@umami/utils";
import { type SessionTypes, type SignClientTypes, type Verify } from "@walletconnect/types";

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
          throw new WalletConnectError(
            "Getting accounts is not supported yet",
            "WC_METHOD_UNSUPPORTED",
            session
          );
        }

        case "tezos_sign": {
          throw new WalletConnectError(
            "Sign is not supported yet",
            "WC_METHOD_UNSUPPORTED",
            session
          );
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
