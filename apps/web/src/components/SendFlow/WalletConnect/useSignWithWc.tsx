import { type TezosToolkit } from "@taquito/taquito";
import { useDynamicModalContext } from "@umami/components";
import { executeOperations, totalFee } from "@umami/core";
import { useAsyncActionHandler, walletKit } from "@umami/state";
import { formatJsonRpcResult } from "@walletconnect/jsonrpc-utils";
import { useForm } from "react-hook-form";

import { SuccessStep } from "../SuccessStep";
import { type CalculatedSignProps, type SdkSignPageProps } from "../utils";

export const useSignWithWalletConnect = ({
  operation,
  headerProps,
  requestId,
}: SdkSignPageProps): CalculatedSignProps => {
  const { isLoading: isSigning, handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();

  const form = useForm({ defaultValues: { executeParams: operation.estimates } });

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

        const response = formatJsonRpcResult(requestId.id, { hash: opHash });
        await walletKit.respondSessionRequest({ topic: requestId.topic, response });
        return openWith(<SuccessStep hash={opHash} />);
      },
      error => ({
        description: `Failed to confirm Beacon operation: ${error.message}`,
      })
    );

  return {
    fee: totalFee(form.watch("executeParams")),
    isSigning,
    onSign,
    network: headerProps.network,
  };
};
