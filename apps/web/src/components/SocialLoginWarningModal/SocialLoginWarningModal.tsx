import {
  Button,
  Checkbox,
  Flex,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useState } from "react";

import { AlertIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const SocialLoginWarningModal = () => {
  const { onClose } = useDynamicModalContext();
  const color = useColor();
  const [isAgreed, setIsAgreed] = useState(false);

  const handleInform = () => {
    onClose();
  };

  return (
    <ModalContent maxWidth="440px">
      <ModalHeader>
        <Flex alignItems="center" justifyContent="center" flexDirection="column" gap="16px">
          <AlertIcon width="22px" color={color("400")} />
          <Heading size="xl">Important notice about your social account wallet</Heading>
        </Flex>
      </ModalHeader>
      <ModalBody>
        <Flex alignItems="center" flexDirection="column" gap="16px" textAlign="center">
          <Text color={color("700")} fontSize="md">
            Wallets created with social accounts depend on those accounts to function. Losing access
            to this social account will result in loosing the wallet. Enable two-factor
            authentication to protect your social accounts.
          </Text>
          <Checkbox
            color={color("700")}
            isChecked={isAgreed}
            onChange={e => setIsAgreed(e.target.checked)}
          >
            <Text fontWeight="bold">I understand and accept the risks.</Text>
          </Checkbox>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Button width="full" isDisabled={!isAgreed} onClick={handleInform} variant="primary">
          Continue
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
