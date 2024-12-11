import {
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useState } from "react";

import { WarningIcon } from "../../assets/icons";
import colors from "../../style/colors";

export const SocialLoginWarningModal = () => {
  const { onClose } = useDynamicModalContext();
  const [isAgreed, setIsAgreed] = useState(false);

  const handleInform = () => {
    localStorage.setItem("user:isSocialLoginWarningShown", "true");
    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="16px"
          textAlign="center"
        >
          <Icon as={WarningIcon} width="22px" stroke={colors.gray[450]} />
          <Heading size="xl">Important notice about your social account wallet</Heading>
        </Flex>
      </ModalHeader>
      <ModalBody marginTop="24px">
        <Flex alignItems="center" flexDirection="column" gap="16px" textAlign="center">
          <Text color={colors.gray[400]} fontSize="md">
            Wallets created with social accounts depend on those accounts to function. Losing access
            to this social account will result in loosing the wallet. Enable two-factor
            authentication to protect your social accounts.
          </Text>
          <Checkbox
            marginTop="16px"
            color={colors.gray[400]}
            isChecked={isAgreed}
            onChange={e => setIsAgreed(e.target.checked)}
          >
            <Text fontSize="sm" fontWeight="bold">
              I understand and accept the risks.
            </Text>
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
