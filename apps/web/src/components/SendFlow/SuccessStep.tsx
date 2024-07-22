import {
  Button,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { DynamicModalContext } from "@umami/components";
import { useSelectedNetwork } from "@umami/state";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { StubIcon as WindowLinkIcon } from "../../assets/icons";

export const SuccessStep = ({ hash }: { hash: string }) => {
  const network = useSelectedNetwork();
  const tzktUrl = `${network.tzktExplorerUrl}/${hash}`;
  const { onClose } = useContext(DynamicModalContext);
  const navigate = useNavigate();

  return (
    <ModalContent paddingY="20px">
      <ModalCloseButton />
      <ModalHeader textAlign="center">
        <Heading>Operation Submitted</Heading>
      </ModalHeader>
      <ModalBody>
        <Flex justifyContent="center" marginTop="10px">
          <Text color="text.dark" textAlign="center" size="sm">
            You can follow this operation's progress in the Operations section. It may take up to 30
            seconds to appear.
          </Text>
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center" flexDirection="column" width="100%">
        <Button
          width="100%"
          onClick={() => {
            onClose();
            navigate("/activity");
          }}
          size="lg"
        >
          See all Operations
        </Button>
        <Link rel="noopener noreferrer" target="_blank" to={tzktUrl}>
          <Flex alignItems="center" marginTop="24px">
            <Button variant="CTAWithIcon">
              <Text marginRight="4px">View in Tzkt</Text>
              <WindowLinkIcon stroke="currentcolor" />
            </Button>
          </Flex>
        </Link>
      </ModalFooter>
    </ModalContent>
  );
};
