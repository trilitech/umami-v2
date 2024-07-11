import {
  Box,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";

import { AccountSelector } from "../../components/AccountCard";

type RecipientsPageProps = {
  accounts: { name: string; pkh: string }[];
  onSelect: (pkh: string) => void;
};

export const RecipientsPage = ({ accounts, onSelect }: RecipientsPageProps) => {
  const showBalance = useBreakpointValue({ base: false, lg: true });
  const { goBack } = useDynamicModalContext();

  return (
    <ModalContent>
      <ModalHeader>
        Select Recipient
        <ModalCloseButton onClick={goBack} />
      </ModalHeader>
      <ModalBody>
        <VStack gap="0" overflowY="auto" width="full" height="288px">
          {accounts.map(account => (
            <Box
              key={account.pkh}
              width="full"
              cursor="pointer"
              onClick={() => {
                onSelect(account.pkh);
                goBack();
              }}
            >
              <AccountSelector account={account} showBalance={showBalance} />
            </Box>
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
