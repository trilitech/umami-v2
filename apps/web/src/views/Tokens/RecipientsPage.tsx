import {
  Box,
  Button,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicModalContext, useDynamicModalFormContext } from "@umami/components";

import { ArrowLeftCircleIcon, CloseIcon } from "../../assets/icons";
import { AccountSelector } from "../../components/AccountCard";

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
        <IconButton
          position="absolute"
          top="12px"
          left="12px"
          width="24px"
          color="gray.400"
          aria-label="Back"
          icon={<ArrowLeftCircleIcon />}
          onClick={goBack}
          variant="empty"
        />
        Select Recipient
        <ModalCloseButton width="24px" color="gray.400">
          <CloseIcon />
        </ModalCloseButton>
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
