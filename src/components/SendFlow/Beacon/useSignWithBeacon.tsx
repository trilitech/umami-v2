import { TezosToolkit } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { noop } from "lodash";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ImplicitOperations } from "../../../types/AccountOperations";
import { useSelectedNetwork } from "../../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { estimate, executeOperations } from "../../../utils/tezos";
import { DynamicModalContext } from "../../DynamicModal";
import { SuccessStep } from "../SuccessStep";

export const useSignWithBeacon = (
  operation: ImplicitOperations,
  onBeaconSuccess: (hash: string) => Promise<void>
) => {
  const { onClose } = useContext(DynamicModalContext);
  const [fee, setFee] = useState<BigNumber | null>(null);
  const network = useSelectedNetwork();
  const { isLoading: isSigning, handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const form = useForm<{ sender: string; signer: string }>({
    mode: "onBlur",
    defaultValues: {
      signer: operation.signer.address.pkh,
      sender: operation.sender.address.pkh,
    },
  });

  useEffect(() => {
    handleAsyncAction(
      async () => {
        const fee = await estimate(operation, network);
        setFee(fee);
      },
      err => {
        onClose();
        return {
          title: "Error",
          description: `Error while processing beacon request: ${err.message}`,
          status: "error",
        };
      }
    ).catch(noop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, operation]);

  const onSign = async (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(async () => {
      const { opHash } = await executeOperations(operation, tezosToolkit);
      await openWith(<SuccessStep hash={opHash} />);
      return onBeaconSuccess(opHash);
    });

  return {
    fee,
    form,
    isSigning,
    onSign,
  };
};
