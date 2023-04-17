import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

export const useCreateOrImportSecret = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent bg="umami.gray.900">
          <ModalCloseButton />
          <ModalHeader textAlign={"center"}>Create account</ModalHeader>
          <ModalBody>
            <VStack>
              <Button>Create new secret</Button>
              <Button>Import secret with recovery phrase</Button>
              <Button>Import backup file</Button>
              <Button>Import social account</Button>
              <Button>Connect ledger</Button>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent={"center"} flexDirection="column">
            <Flex mt={4} alignItems={"center"} justifyContent="space-between">
              <Button onClick={onClose}>Cancel</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};
