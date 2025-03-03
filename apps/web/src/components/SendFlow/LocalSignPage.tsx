import {
  Flex,
  FormControl,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  type FA12TokenBalance,
  type FA2TokenBalance,
  type TezTransfer,
  type TokenTransfer,
} from "@umami/core";
import { type Address } from "@umami/tezos";
import { CustomError } from "@umami/utils";
import { FormProvider } from "react-hook-form";

import { SignButton } from "./SignButton";
import { SignPageFee } from "./SignPageFee";
import { SignPageHeader } from "./SignPageHeader";
import { type LocalSignPageProps, useSignPageHelpers } from "./utils";
import { AddressTile } from "../AddressTile";
import { AdvancedSettingsAccordion } from "../AdvancedSettingsAccordion";
import { TezTile, TokenTile } from "../AssetTiles";

export const LocalSignPage = (props: LocalSignPageProps) => {
  const { operations: initialOperations, token, operationType } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, onSign } =
    useSignPageHelpers(initialOperations);
  const hideBalance = useBreakpointValue({ base: true, md: false });

  const operation = operations.operations[0];

  const fields: Record<string, any> = {};

  switch (operationType) {
    case "tez":
      fields["mutezAmount"] = (operation as TezTransfer).amount;
      fields["to"] = (operation as TezTransfer).recipient;
      fields["from"] = operations.sender.address;
      break;
    case "token":
      if (!token) {
        throw new CustomError("Token is required for token operation");
      }
      fields["amount"] = (operation as TokenTransfer).amount;
      fields["to"] = (operation as TokenTransfer).recipient;
      fields["from"] = operations.sender.address;
      fields["token"] = token;
      break;
  }

  const AddressLabelAndTile = (heading: string, address: Address | undefined) => {
    if (!address) {
      return null;
    }
    return (
      <Flex flexDirection="column" width="full">
        <FormLabel>{heading}</FormLabel>
        <AddressTile address={address} hideBalance={hideBalance} />
      </Flex>
    );
  };

  const Fee = () => (
    <Flex justifyContent="end" width="full" marginTop="12px">
      <SignPageFee fee={fee} />
    </Flex>
  );

  const MutezAndFee = (mutezAmount: string | undefined) => {
    if (!mutezAmount) {
      return null;
    }
    return (
      <Flex flexDirection="column" width="full">
        <FormLabel width="full">Amount</FormLabel>
        <TezTile mutezAmount={mutezAmount} />
        <Fee />
      </Flex>
    );
  };

  const TokenAndFee = (token: FA12TokenBalance | FA2TokenBalance | undefined, amount: string) => {
    if (!token) {
      return null;
    }
    return (
      <Flex flexDirection="column" width="full">
        <FormLabel width="full">Amount</FormLabel>
        <TokenTile amount={amount} token={token} />
        <Fee />
      </Flex>
    );
  };

  const formFields = {
    mutezAmount: MutezAndFee(fields["mutezAmount"]),
    from: AddressLabelAndTile("From", fields["from"]),
    to: AddressLabelAndTile("To", fields["to"]),
    token: TokenAndFee(fields["token"], fields["amount"]),
  };

  const renderField = (key: keyof typeof formFields) => formFields[key];

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader />
          <FormControl>
            <ModalBody gap="24px">
              <VStack alignItems="start" spacing="24px">
                {renderField("mutezAmount")}
                {renderField("token")}
                {renderField("from")}
                {renderField("to")}
                <AdvancedSettingsAccordion />
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
          </FormControl>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
