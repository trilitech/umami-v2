import {
  Box,
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicModalContext, useDynamicModalFormContext } from "@umami/components";

import { AccountSelector } from "../../components/AccountCard";
import { ModalBackButton } from "../../components/ModalBackButton";
import { ModalCloseButton } from "../../components/ModalCloseButton";

type RecipientsPageProps = {
  accounts: { name: string; pkh: string }[];
};

export const RecipientsPage = ({ accounts }: RecipientsPageProps) => {
  const showBalance = useBreakpointValue({ base: false, lg: true });
  const { goBack } = useDynamicModalContext();
  const { setFormState } = useDynamicModalFormContext();

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton onClick={goBack} />
        Select Recipient
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <VStack gap="0" overflowY="auto" width="full" height="288px">
          {accounts.map(account => (
            <Box
              key={account.pkh}
              width="full"
              cursor="pointer"
              onClick={() => {
                goBack();
                setFormState({ recipient: account.pkh });
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
