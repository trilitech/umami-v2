import {
  Button,
  Flex,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { WindowLinkIcon } from "../../assets/icons/WindowLink";
import colors from "../../style/colors";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { DynamicModalContext } from "../DynamicModal";

export const SuccessStep: React.FC<{ hash: string }> = ({ hash }) => {
  const network = useSelectedNetwork();
  const tzktUrl = `${network.tzktExplorerUrl}/${hash}`;
  const { onClose } = useContext(DynamicModalContext);

  return (
    <ModalContent paddingY="20px">
      <ModalCloseButton />
      <ModalHeader textAlign="center">Operation Submitted</ModalHeader>
      <ModalBody>
        <Flex justifyContent="center" marginTop="10px">
          <Text color="text.dark" textAlign="center" size="sm">
            You can follow this operation's progress in the Operations section. It may take up to 30
            seconds to appear.
          </Text>
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center" flexDirection="column" width="100%">
        <Link to="/operations">
          <Button width="400px" onClick={onClose} size="lg">
            See all Operations
          </Button>
        </Link>
        <Link rel="noopener noreferrer" target="_blank" to={tzktUrl}>
          <Flex alignItems="center" marginTop="24px">
            <Text marginRight="4px" color={colors.gray[300]}>
              View in Tzkt
            </Text>
            <WindowLinkIcon />
          </Flex>
        </Link>
      </ModalFooter>
    </ModalContent>
  );
};
