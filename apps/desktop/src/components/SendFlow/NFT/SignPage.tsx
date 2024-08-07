import {
  Center,
  Flex,
  FormLabel,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { type FA2Transfer, type NFTBalance } from "@umami/core";
import { FormProvider } from "react-hook-form";

import colors from "../../../style/colors";
import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { OperationSignerSelector } from "../OperationSignerSelector";
import { SendNFTRecapTile } from "../SendNFTRecapTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { type SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage = (props: SignPageProps<{ nft: NFTBalance }>) => {
  const {
    mode,
    operations: initialOperations,
    data: { nft },
  } = props;

  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialOperations, mode);

  const { recipient } = operations.operations[0] as FA2Transfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} signer={operations.signer} />
          <ModalBody>
            <Flex marginBottom="12px">
              <SendNFTRecapTile nft={nft} />
            </Flex>

            <Flex alignItems="center" justifyContent="space-between" marginY="12px" paddingX="4px">
              <Flex alignItems="center">
                <Heading marginRight="4px" color={colors.gray[450]} size="sm">
                  Owned:
                </Heading>
                <Text color={colors.gray[400]} data-testid="nft-owned" size="sm">
                  {nft.balance}
                </Text>
              </Flex>

              <SignPageFee fee={fee} />
            </Flex>

            <Flex alignItems="center" marginTop="12px" marginBottom="24px">
              <Heading marginRight="12px" size="md">
                Quantity:
              </Heading>
              <Center width="100px" height="48px" background={colors.gray[800]} borderRadius="4px">
                <Text textAlign="center">
                  {(operations.operations[0] as FA2Transfer).amount} out of {nft.balance}
                </Text>
              </Center>
            </Flex>

            <FormLabel>From</FormLabel>
            <AddressTile marginBottom="24px" address={operations.sender.address} />
            <FormLabel>To</FormLabel>
            <AddressTile address={recipient} />

            <OperationSignerSelector
              isLoading={isLoading}
              operationType={operations.type}
              reEstimate={reEstimate}
              sender={operations.sender}
            />

            <AdvancedSettingsAccordion />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isDisabled={estimationFailed}
              isLoading={isLoading}
              onSubmit={onSign}
              signer={signer}
              text={headerText(operations.type, mode)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
