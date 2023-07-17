import { Modal, useDisclosure, useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import ApproveExecuteForm from "./ApproveExecuteForm";
import { useGetPk } from "../../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../../utils/hooks/assetsHooks";
import { estimateMultisigApproveOrExecute } from "../../../utils/tezos";
import { ApproveExecuteParams } from "./types";

function useModal<T>(Component: React.ComponentType<{ params: T }>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const paramsRef = useRef<T | undefined>(undefined);

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        {paramsRef.current && <Component params={paramsRef.current} />}
      </Modal>
    ),
    onOpen: (options: T) => {
      // We use a ref because since setState is async we have no guarantee that
      // params will be up to date when we call onOpen
      paramsRef.current = options;
      onOpen();
    },
  };
}

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
      const { suggestedFeeMutez } = await estimateMultisigApproveOrExecute(
        {
          type: params.type,
          contract: params.multisigAddress,
          operationId: params.operation.id,
        },
        pk,
        params.signer.pkh,
        network
      );
      onOpen({ ...params, suggestedFeeMutez });
    } catch (error: any) {
      console.warn("Failed simulation", error);
      toast({ title: "Failed simulation", description: error.message, status: "warning" });
    }

    setIsLoading(false);
  };

  return { modalElement, isLoading, approveOrExecute };
};
