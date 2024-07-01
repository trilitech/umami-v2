import { type PartialTezosOperation } from "@airgap/beacon-types";
import { Center, Modal, ModalCloseButton, ModalContent, useDisclosure } from "@chakra-ui/react";
import { type Network, type UserData } from "@trilitech-umami/umami-embed/types";
import { useState } from "react";

import { OperationModalContent } from "./SignOperationModalContent";
import { sendOperationErrorResponse } from "./utils";

export const useSignOperationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [operations, setOperations] = useState<PartialTezosOperation[]>([]);

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
              userData={userData!}
              network={network!}
              operations={operations}
            />
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen: (userData: UserData, network: Network, operations: PartialTezosOperation[]) => {
      setUserData(userData);
      setNetwork(network);
      setOperations(operations);
      onOpen();
    },
  };
};
