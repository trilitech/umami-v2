import {
  Button,
  Flex,
  Heading,
  Link,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useSelectedNetwork } from "@umami/state";
import { useNavigate } from "react-router-dom";

import { StubIcon as WindowLinkIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ModalCloseButton } from "../CloseButton";

export const SuccessStep = ({ hash }: { hash: string }) => {
  const network = useSelectedNetwork();
  const tzktUrl = `${network.tzktExplorerUrl}/${hash}`;
  const { onClose } = useDynamicModalContext();
  const navigate = useNavigate();
  const color = useColor();

  return (
    <ModalContent paddingY="20px">
      <ModalCloseButton />
      <ModalHeader textAlign="center">
        <Heading>Operation Submitted</Heading>
      </ModalHeader>
      <ModalBody>
        <Flex justifyContent="center" marginTop="10px">
          <Text color={color("700")} textAlign="center" size="sm">
            You can follow this operation's progress in the Operations section. It may take up to 30
            seconds to appear.
          </Text>
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center" flexDirection="column" gap="12px" width="100%">
        <Button
          width="100%"
          onClick={() => {
            onClose();
            navigate("/activity");
          }}
          size="lg"
          variant="primary"
        >
          See all Operations
        </Button>
        <Button as={Link} width="full" href={tzktUrl} isExternal variant="tertiary">
          <Text marginRight="4px">View in Tzkt</Text>
          <WindowLinkIcon stroke="currentcolor" />
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
