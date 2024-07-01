import { type PartialTezosOperation } from "@airgap/beacon-types";
import { Center, Modal, ModalCloseButton, ModalContent, useDisclosure } from "@chakra-ui/react";
import { type Network, type UserData } from "@trilitech-umami/umami-embed/types";
import { useState } from "react";
import {
  estimate,
  type EstimatedAccountOperations,
  type ImplicitAccount,
  type ImplicitOperations,
} from "@umami/core";

import { OperationModalContent } from "./SignOperationModalContent";
import { sendOperationErrorResponse, toSocialAccount, toTezosNetwork } from "./utils";
import { partialOperationToOperation } from "./imported/utils/beaconUtils";

export const useSignOperationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [operations, setOperations] = useState<PartialTezosOperation[]>([]);
  const [estimatedOperations, setEstimatedOperations] = useState<EstimatedAccountOperations | null>(
    null
  );

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
              estimatedOperations={estimatedOperations!}
            />
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen: async (userData: UserData, network: Network, operations: PartialTezosOperation[]) => {
      const accountOperations = toAccountOperations(operations, toSocialAccount(userData));
      const estimatedOperations = await estimate(accountOperations, toTezosNetwork(network));

      setUserData(userData);
      setNetwork(network);
      setOperations(operations);
      setEstimatedOperations(estimatedOperations);
      onOpen();
    },
  };
};

/**
 * takes a list of {@link PartialTezosOperation} which come from Beacon
 * and converts them to {@link ImplicitOperations}
 *
 * @param operationDetails - the list of operations to convert
 * @param signer - the {@link Account} that's going to sign the operation
 * @returns
 */
export const toAccountOperations = (
  operationDetails: PartialTezosOperation[],
  signer: ImplicitAccount
): ImplicitOperations => {
  if (operationDetails.length === 0) {
    throw new Error("Empty operation details!");
  }

  const operations = operationDetails.map(operation =>
    partialOperationToOperation(operation, signer)
  );

  return {
    type: "implicit",
    sender: signer,
    operations,
    signer,
  };
};
