import {
  BeaconMessageType,
  OperationRequestOutput,
  OperationResponseInput,
} from "@airgap/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { useContext } from "react";

import { ImplicitOperations } from "../../../types/AccountOperations";
import { WalletClient } from "../../../utils/beacon/WalletClient";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { executeOperations } from "../../../utils/tezos";
import { DynamicModalContext } from "../../DynamicModal";
import { SuccessStep } from "../SuccessStep";

export const useSignWithBeacon = (
  operation: ImplicitOperations,
  message: OperationRequestOutput
) => {
  const { isLoading: isSigning, handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);

  const onSign = async (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        const { opHash } = await executeOperations(operation, tezosToolkit);

        const response: OperationResponseInput = {
          type: BeaconMessageType.OperationResponse,
          id: message.id,
          transactionHash: opHash,
        };
        await WalletClient.respond(response);

        return openWith(<SuccessStep hash={opHash} />);
      },
      error => ({
        description: `Failed to confirm Beacon operation: ${error.message}`,
      })
    );

  return {
    isSigning,
    onSign,
  };
};
