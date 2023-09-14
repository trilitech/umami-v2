import { useContext, useEffect, useState } from "react";
import { ImplicitOperations } from "../../sendForm/types";
import BigNumber from "bignumber.js";
import { TezosToolkit } from "@taquito/taquito";
import { useSelectedNetwork } from "../../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { DynamicModalContext } from "../../DynamicModal";
import { useForm } from "react-hook-form";
import { estimate, executeOperations } from "../../../utils/tezos";
import { SuccessStep } from "../../sendForm/steps/SuccessStep";

export const useSignWithBeacon = (
  operation: ImplicitOperations,
  onBeaconSuccess: (hash: string) => Promise<void>
) => {
  const [fee, setFee] = useState<BigNumber | null>(null);
  const network = useSelectedNetwork();
  const { isLoading: isSigning, handleAsyncAction } = useAsyncActionHandler();
  const { handleAsyncAction: handleFeeEstimation } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const form = useForm<{ sender: string; signer: string }>({
    mode: "onBlur",
    defaultValues: {
      signer: operation.signer.address.pkh,
      sender: operation.sender.address.pkh,
    },
  });

  useEffect(() => {
    const estimateFee = () =>
      handleFeeEstimation(
        async () => {
          const fee = await estimate(operation, network);
          setFee(fee);
        },
        err => ({
          title: "Error",
          description: `Error while processing beacon request: ${err.message}`,
          status: "error",
        })
      );
    estimateFee();
  }, [network, operation, handleFeeEstimation]);

  const onSign = async (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(async () => {
      const { opHash } = await executeOperations(operation, tezosToolkit);
      openWith(<SuccessStep hash={opHash} />);
      onBeaconSuccess(opHash);
    });

  return {
    fee,
    form,
    isSigning,
    onSign,
  };
};

export default useSignWithBeacon;
