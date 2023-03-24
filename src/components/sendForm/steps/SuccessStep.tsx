import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import React from "react";

export const SuccessStep: React.FC<{ hash: string }> = ({ hash }) => {
  return (
    <ModalContent bg="umami.gray.900">
      <ModalCloseButton />
      <ModalHeader textAlign={"center"}>Operation Submitted</ModalHeader>
      <Text textAlign={"center"}>Transaction details</Text>
      <ModalBody>
        <Text>Operation hash: {hash}</Text>
      </ModalBody>
      <ModalFooter>
        <Button width={"100%"} bg="umami.blue">
          Go to operation
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
