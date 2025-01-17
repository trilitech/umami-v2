import {
  Button,
  Center,
  Heading,
  Icon,
  Link,
  ModalBody,
  ModalContent,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useSelectedNetwork } from "@umami/state";
import { useNavigate } from "react-router-dom";

import { CheckCircleIcon, ExternalLinkIcon } from "../../assets/icons";
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
      <ModalHeader textAlign="center">
        <ModalCloseButton />
        <Center flexDirection="column">
          <Icon as={CheckCircleIcon} boxSize="24px" marginBottom="18px" color={color("green")} />
          <Heading marginBottom="12px" size="xl">
            Operation Submitted
          </Heading>
          <Text
            maxWidth="340px"
            color={color("700")}
            fontWeight="400"
            whiteSpace="break-spaces"
            size="md"
          >
            {
              "You can follow this operation's progress\n in the Operations section. It may take up to 30 seconds to appear."
            }
          </Text>
        </Center>
      </ModalHeader>
      <ModalBody gap="24px">
        <Button
          width="100%"
          onClick={() => {
            onClose();
            void navigate("/activity");
          }}
          size="lg"
          variant="primary"
        >
          See all Operations
        </Button>
        <Button as={Link} gap="10px" width="full" href={tzktUrl} isExternal variant="ghost">
          <ExternalLinkIcon color={color("400")} />
          <Text marginRight="4px">View in TzKT</Text>
        </Button>
      </ModalBody>
    </ModalContent>
  );
};
