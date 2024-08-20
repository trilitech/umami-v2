import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicModalContext, useFormValuesContext } from "@umami/components";
import { useAppSelector, useGetAccountBalance } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";

import { AccountTile } from "../AccountTile";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";

export const RecipientsModal = () => {
  const accounts = useAppSelector(s => s.accounts.items);
  const showAmount = useBreakpointValue({ base: false, lg: true });
  const { goBack, updateFormValues } = useDynamicModalContext();
  const getBalance = useGetAccountBalance();

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        Select Recipient
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <VStack overflowY="auto" width="full" height="288px">
          {accounts.map(account => {
            const balance = getBalance(account.address.pkh);

            return (
              <AccountTile
                key={account.address.pkh}
                width="full"
                account={account}
                onClick={() => {
                  updateFormValues({
                    recipient: account.address.pkh,
                  });
                  goBack();
                }}
              >
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
