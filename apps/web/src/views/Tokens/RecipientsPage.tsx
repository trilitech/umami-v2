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
import { useAppSelector, useGetAccountBalance } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";

import { AccountTile } from "../../components/AccountTile";

export const RecipientsPage = () => {
  const accounts = useAppSelector(s => s.accounts.items);
  const showAmount = useBreakpointValue({ base: false, md: true });
  const { goBack } = useDynamicModalContext();
  const getBalance = useGetAccountBalance();

  return (
    <ModalContent>
      <ModalHeader>
        Select Recipient
        <ModalCloseButton onClick={goBack} />
      </ModalHeader>
      <ModalBody>
        <VStack overflowY="auto" width="full" height="288px">
          {accounts.map(account => {
            const balance = getBalance(account.address.pkh);
            return (
              <AccountTile key={account.address.pkh} account={account}>
                {showAmount && balance && (
                  <Text width="full" marginTop="auto" paddingBottom="2px" textAlign="end" size="sm">
                    {prettyTezAmount(balance)}
                  </Text>
                )}
              </AccountTile>
            );
          })}
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
