import {
  Flex,
  FormControl,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  VStack,
} from "@chakra-ui/react";
import {
  PrettyNumber,
  SignButton,
  SignPageFee,
  type SignPageProps,
  useDynamicModalContext,
  useSignPageHelpers,
} from "@umami/components";
import {
  type FA12TokenBalance,
  type FA2TokenBalance,
  type TokenTransfer,
  tokenPrettyAmount,
} from "@umami/core";
import { FormProvider } from "react-hook-form";

import { TokenIcon } from "../../assets/icons";
import { AccountSelector } from "../../components/AccountCard";
import { TokenIconWrapper } from "../../components/IconWrapper";
import { ModalBackButton } from "../../components/ModalBackButton";
import { ModalCloseButton } from "../../components/ModalCloseButton";

export const SignTokensPage = (
  props: SignPageProps<{ token: FA12TokenBalance | FA2TokenBalance }>
) => {
  const {
    mode,
    operations: initialOperations,
    data: { token },
  } = props;
  const { fee, operations, estimationFailed, isLoading, signer, onSign, form } = useSignPageHelpers(
    initialOperations,
    mode
  );

  const { amount, recipient } = operations.operations[0] as TokenTransfer;
  const { goBack } = useDynamicModalContext();
  const prettyAmount = tokenPrettyAmount(amount, token);

  return (
    <FormProvider {...form}>
      <ModalContent>
        <ModalHeader>
          <ModalBackButton onClick={goBack} />
          Confirm Transaction
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <VStack gap="24px" width="full">
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Flex
                alignItems="center"
                gap="16px"
                height="72px"
                background="gray.50"
                paddingX="16px"
                rounded="6px"
              >
                <TokenIconWrapper>
                  <TokenIcon
                    width="42px"
                    minWidth="42px"
                    contract={token.contract}
                    rounded="full"
                  />
                </TokenIconWrapper>
                <PrettyNumber color="gray.900" number={prettyAmount} />
              </Flex>
              <Flex alignItems="center" justifyContent="end" marginTop="12px">
                <SignPageFee fee={fee} />
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel>From</FormLabel>
              <AccountSelector
                account={{ name: operations.sender.label, pkh: operations.sender.address.pkh }}
                highlighted
                rounded="6px"
              />
            </FormControl>
            <FormControl>
              <FormLabel>To</FormLabel>
              <AccountSelector
                account={{ pkh: recipient.pkh, address: recipient }}
                highlighted
                rounded="6px"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <SignButton
            isDisabled={estimationFailed}
            isLoading={isLoading}
            onSubmit={onSign}
            signer={signer}
            text="Confirm"
          />
        </ModalFooter>
      </ModalContent>
    </FormProvider>
  );
};
