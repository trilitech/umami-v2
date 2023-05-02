import {
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import React from "react";

const PermissionRequest = () => {
  return (
    <ModalContent>
      <ModalHeader>Modal Title</ModalHeader>
      <ModalCloseButton />
      <ModalBody></ModalBody>

      <ModalFooter>hello</ModalFooter>
    </ModalContent>
  );
};

export default PermissionRequest;
