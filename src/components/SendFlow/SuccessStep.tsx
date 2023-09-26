import {
  Button,
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

import React, { useContext } from "react";
import { getHashUrl } from "../../views/operations/operationsUtils";
import { TzktLink } from "../TzktLink";
import { DynamicModalContext } from "../DynamicModal";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";

export const SuccessStep: React.FC<{ hash: string }> = ({ hash }) => {
  const network = useSelectedNetwork();
  const tzktUrl = getHashUrl({ hash, network });
  const { onClose } = useContext(DynamicModalContext);

  return (
    <ModalContent paddingY="20px">
      <ModalCloseButton />
      <ModalHeader textAlign="center">
        Operation Submitted
        <Flex justifyContent="center">
          <Text color="text.dark" size="sm" textAlign="center" width="340px">
            You can follow this operation's progress in the Operations section.
          </Text>
        </Flex>
      </ModalHeader>
      <ModalBody p="0"></ModalBody>
      <ModalFooter justifyContent="center" flexDirection="column">
        <Link to="/operations">
          <Button width="100%" onClick={onClose}>
            Go to operation
          </Button>
        </Link>
        <Flex mt={4} alignItems="center" justifyContent="space-between">
          <Text color="text.dark">View in Tzkt</Text>
          <TzktLink ml={4} url={tzktUrl} />
        </Flex>
      </ModalFooter>
    </ModalContent>
  );
};
