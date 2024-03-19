import { Button, Flex, Text } from "@chakra-ui/react";

import { AddAccountIcon } from "../../assets/icons";
import { useOnboardingModal } from "../../components/Onboarding/useOnboardingModal";

export const AccountListHeader = () => {
  const { onOpen, modalElement } = useOnboardingModal();
  return (
    <Flex flexDirection="row-reverse" marginTop="12px" marginBottom="16px">
      <Button paddingRight="0" onClick={onOpen} variant="CTAWithIcon">
        <AddAccountIcon stroke="currentcolor" />
        <Text marginLeft="4px" size="sm">
          Add Account
        </Text>
      </Button>
      {modalElement}
    </Flex>
  );
};
