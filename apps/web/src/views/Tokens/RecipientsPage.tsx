import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useAppSelector } from "@umami/state";

import { AccountSelector } from "../../components/AccountCard";

export const RecipientsPage = () => {
  const accounts = useAppSelector(s => s.accounts.items);
  const showAmount = useBreakpointValue({ base: false, lg: true });
  const { goBack } = useDynamicModalContext();

  return (
    <ModalContent>
      <ModalHeader>
        Select Recipient
        <ModalCloseButton onClick={goBack} />
      </ModalHeader>
      <ModalBody>
        <VStack overflowY="auto" width="full" height="288px">
          {accounts.map(account => (
            <AccountSelector
              key={account.address.pkh}
              account={account}
              sideElement={
                showAmount ? (
                  <Text width="full" marginTop="auto" paddingBottom="2px" textAlign="end" size="sm">
                    2882.675746 ꜩ
                  </Text>
                ) : null
              }
            />
          ))}
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button width="full" onClick={goBack} rounded="full" variant="secondary">
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
