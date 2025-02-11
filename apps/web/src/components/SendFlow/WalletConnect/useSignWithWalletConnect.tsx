import { type TezosToolkit } from "@taquito/taquito";
import { useDynamicModalContext } from "@umami/components";
import { executeOperations, totalFee } from "@umami/core";
import { useAsyncActionHandler, walletKit } from "@umami/state";
import { getErrorContext } from "@umami/utils";
import { formatJsonRpcResult } from "@walletconnect/jsonrpc-utils";
import { useForm } from "react-hook-form";

import { SuccessStep } from "../SuccessStep";
import { type CalculatedSignProps, type SdkSignPageProps } from "../utils";

export const useSignWithWalletConnect = ({
  operation,
  headerProps,
}: SdkSignPageProps): CalculatedSignProps => {
  const { isLoading: isSigning, handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();

  const form = useForm({ defaultValues: { executeParams: operation.estimates } });
  const requestId = headerProps.requestId;

  if (requestId.sdkType !== "walletconnect") {
    return {
      fee: 0,
      isSigning: false,
      onSign: async () => {},
      network: null,
    };
  }

  const onSign = async (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        const { opHash } = await executeOperations(
          { ...operation, estimates: form.watch("executeParams") },
          tezosToolkit
        );

        try {
          const response = formatJsonRpcResult(requestId.id, {
            hash: opHash,
            operationHash: opHash,
          });
          await walletKit.respondSessionRequest({ topic: requestId.topic, response });
        } catch (error: any) {
          const errorContext = getErrorContext(error);
          await openWith(
            <SuccessStep dAppNotificationError={errorContext.description} hash={opHash} />,
            { canBeOverridden: true }
          );
          error.processed = true; // no toast for this error
          throw error;
        }
        return openWith(<SuccessStep hash={opHash} />, { canBeOverridden: true });
      },
      (error: { message: any }) => ({
        description: `Failed to perform WalletConnect operation: ${error.message}`,
      })
    );

  return {
    fee: totalFee(form.watch("executeParams")),
    isSigning,
    onSign,
    network: headerProps.network,
  };
};
