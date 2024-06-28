import { type PartialTezosOperation } from "@airgap/beacon-types";
import { Center, Modal, ModalCloseButton, ModalContent, useDisclosure } from "@chakra-ui/react";
import { Network, type TypeOfLogin } from "@trilitech-umami/umami-embed/types";
import { useState } from "react";

import { OperationModalContent } from "./SignOperationModalContent";
import { sendOperationErrorResponse } from "./utils";

export const useSignOperationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [operations, setOperations] = useState<PartialTezosOperation[]>([]);
  const [loginType, setLoginType] = useState<TypeOfLogin | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);

  const onModalCLose = () => {
    sendOperationErrorResponse("User closed the modal");
    onClose();
  };

  return {
    modalElement: (
      <Center>
        <Modal
          autoFocus={false}
          closeOnOverlayClick={false}
          isCentered
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalContent>
            <ModalCloseButton onClick={onModalCLose} />
            <OperationModalContent
              closeModal={onClose}
              loginType={loginType!}
              network={network!}
              operations={operations}
            />
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen: (
      selectedLoginType: TypeOfLogin,
      network: Network,
      operations: PartialTezosOperation[]
    ) => {
      setOperations(operations);
      setNetwork(network);
      setLoginType(selectedLoginType);
      onOpen();
    },
  };
};
