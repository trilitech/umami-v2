import {
  Divider,
  Flex,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react";
import { type EstimatedAccountOperations, type FA2Transfer, type NFTBalance } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { NFTTile } from "./NFTTile";
import { useColor } from "../../../styles/useColor";
import { AddressTile } from "../../AddressTile/AddressTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader } from "../SignPageHeader";
import { useSignPageHelpers } from "../utils";

export const SignPage = (props: { nft: NFTBalance; operations: EstimatedAccountOperations }) => {
  const { operations: initialOperations, nft } = props;

  const { fee, operations, estimationFailed, isLoading, form, signer, onSign } =
    useSignPageHelpers(initialOperations);
  const color = useColor();

  const { recipient, amount } = operations.operations[0] as FA2Transfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader />
          <ModalBody>
            <VStack alignItems="start" spacing="12px">
              <NFTTile nft={nft} />

              <Flex justifyContent="space-between" width="full" color={color("700")}>
                <Flex alignItems="center" gap="4px">
                  <Heading size="md">Quantity:</Heading>

                  <Flex alignItems="center">
                    <Text data-testid="nft-amount">{amount}</Text>
                    <Text color={color("400")}>/</Text>
                    <Text data-testid="nft-owned">{nft.balance}</Text>
                  </Flex>
                </Flex>

                <SignPageFee fee={fee} />
              </Flex>

              <Divider marginY="12px" />

              <Heading color={color("900")} size="md">
                From
              </Heading>
              <AddressTile address={operations.sender.address} />

              <Heading color={color("900")} size="md">
                To
              </Heading>
              <AddressTile address={recipient} />
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
        </form>
      </ModalContent>
    </FormProvider>
  );
};
