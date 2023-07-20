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

import React from "react";
import { getHashUrl } from "../../../views/operations/operationsUtils";
import { TzktLink } from "../../TzktLink";
import { TezosNetwork } from "../../../types/TezosNetwork";

export const SuccessStep: React.FC<{ hash: string; network: TezosNetwork }> = ({
  hash,
  network,
}) => {
  const tzktUrl = getHashUrl(hash, network);
  return (
    <ModalContent bg="umami.gray.900">
      <ModalCloseButton />
      <ModalHeader textAlign="center">Operation Submitted</ModalHeader>
      <ModalBody>
        <Text mt={2} color="text.dark" textAlign="center">
          You can follow this operation’s progress in the Operations section.
        </Text>
      </ModalBody>
      <ModalFooter justifyContent="center" flexDirection="column">
        <Link to="/operations">
          <Button width="100%" bg="umami.blue">
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
