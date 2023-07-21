import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import ApproveExecuteForm from "./ApproveExecuteForm";
import { useGetPk } from "../../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../../utils/hooks/assetsHooks";
import { estimateMultisigApproveOrExecute } from "../../../utils/tezos";
import { ApproveExecuteParams } from "./types";
import { useModal } from "./useModal";

export const useApproveOrExecuteModdal = () => {
  const { modalElement, onOpen } = useModal(ApproveExecuteForm);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const network = useSelectedNetwork();
  const getPk = useGetPk();

  const approveOrExecute = async (params: ApproveExecuteParams) => {
    setIsLoading(true);
    try {
      const pk = getPk(params.signer.pkh);
      const { totalCost } = await estimateMultisigApproveOrExecute(
        {
          type: params.type,
          contract: params.multisigAddress,
          operationId: params.operation.id,
        },
        pk,
        params.signer.pkh,
        network
      );
      onOpen({ ...params, totalCost });
    } catch (error: any) {
      console.warn("Failed simulation", error);
      toast({ title: "Failed simulation", description: error.message, status: "warning" });
    }

    setIsLoading(false);
  };

  return { modalElement, isLoading, approveOrExecute };
};
