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
import { TzktLink } from "../TzktLink";
import { DynamicModalContext } from "../DynamicModal";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";

export const SuccessStep: React.FC<{ hash: string }> = ({ hash }) => {
  const network = useSelectedNetwork();
  const tzktUrl = `${network.tzktExplorerUrl}/${hash}`;
  const { onClose } = useContext(DynamicModalContext);

  return (
    <ModalContent paddingY="20px">
      <ModalCloseButton />
      <ModalHeader textAlign="center">
        Operation Submitted
        <Flex justifyContent="center">
          <Text width="340px" color="text.dark" textAlign="center" size="sm">
            You can follow this operation's progress in the Operations section.
            <br />
            It may take up to 30 seconds to appear.
          </Text>
        </Flex>
      </ModalHeader>
      <ModalBody padding="0"></ModalBody>
      <ModalFooter justifyContent="center" flexDirection="column">
        <Link to="/operations">
          <Button width="100%" onClick={onClose}>
            Go to operation
          </Button>
        </Link>
        <Flex alignItems="center" justifyContent="space-between" marginTop={4}>
          <Text color="text.dark">View in Tzkt</Text>
          <TzktLink ml={4} url={tzktUrl} />
        </Flex>
      </ModalFooter>
    </ModalContent>
  );
};
