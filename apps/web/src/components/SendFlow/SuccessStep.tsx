import {
  Button,
  Card,
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

import { AlertTriangleIcon, CheckCircleIcon, ExternalLinkIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ModalCloseButton } from "../CloseButton";

export const SuccessStep = ({
  hash,
  dAppNotificationError,
}: {
  hash: string;
  dAppNotificationError?: string;
}) => {
  const network = useSelectedNetwork();
  const tzktUrl = `${network.tzktExplorerUrl}/${hash}`;
  const { onClose } = useDynamicModalContext();
  const navigate = useNavigate();
  const color = useColor();

  type StepData = [React.ElementType, string, string];

  const getIconAndHeader = (): StepData => {
    if (dAppNotificationError) {
      return [AlertTriangleIcon, color("red"), "Operation submitted but dApp not notified"];
    }

    return [CheckCircleIcon, color("green"), "Operation submitted"];
  };

  const Message = () => {
    const successText =
      "You can follow this operation's progress in the Operations section. It may take up to 30 seconds to appear.";

    if (dAppNotificationError) {
      return (
        <>
          <Text marginTop="12px" data-testid="do-not-retry-text" size="md">
            Do <strong>not</strong> retry this operation; it has already been processed. You may
            need to reload the dApp to see the updated status.
          </Text>
          <Text marginTop="12px" data-testid="dapp-noticaition-error" size="md">
            {dAppNotificationError}
          </Text>
          <Text marginTop="12px" data-testid="success-text" size="md">
            {successText}
          </Text>
        </>
      );
    } else {
      return (
        <Text data-testid="success-text" size="md">
          {successText}
        </Text>
      );
    }
  };

  const [icon, iconColor, heading] = getIconAndHeader();

  return (
    <ModalContent paddingY="20px">
      <ModalHeader textAlign="center">
        <ModalCloseButton />
        <Center flexDirection="column">
          <Icon as={icon} boxSize="24px" marginBottom="18px" color={iconColor} />
          <Heading marginTop="24px" marginBottom="24px" size="xl">
            {heading}
          </Heading>
          <Card maxWidth="340px" color={color("700")} fontWeight="400" whiteSpace="pre-line">
            <Message />
          </Card>
        </Center>
      </ModalHeader>
      <ModalBody gap="24px">
        <Button
          width="100%"
          onClick={() => {
            onClose();
            navigate("/activity");
          }}
          size="lg"
          variant="primary"
        >
          See all operations
        </Button>
        <Button as={Link} gap="10px" width="full" href={tzktUrl} isExternal variant="ghost">
          <ExternalLinkIcon color={color("400")} />
          <Text marginRight="4px">View in TzKT</Text>
        </Button>
      </ModalBody>
    </ModalContent>
  );
};
