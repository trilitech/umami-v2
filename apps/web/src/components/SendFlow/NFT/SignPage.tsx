import {
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  VStack,
  useBreakpointValue,
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
  const hideBalance = useBreakpointValue({ base: true, md: false });

  const { recipient, amount } = operations.operations[0] as FA2Transfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader />
          <ModalBody>
            <VStack alignItems="start" spacing="24px">
              <Flex flexDirection="column" gap="12px" width="full" color={color("700")}>
                <NFTTile nft={nft} />
                <Flex gap="4px">
                  <Heading size="md">Quantity:</Heading>
                  <Text data-testid="nft-amount">{amount}</Text>
                  <Text color={color("400")}>/</Text>
                  <Text marginRight="auto" data-testid="nft-owned">
                    {nft.balance}
                  </Text>
                  <SignPageFee fee={fee} />
                </Flex>
              </Flex>
              <Divider />
              <FormControl>
                <FormLabel>From</FormLabel>
                <AddressTile address={operations.sender.address} hideBalance={hideBalance} />
              </FormControl>
              <FormControl>
                <FormLabel>To</FormLabel>
                <AddressTile address={recipient} hideBalance={hideBalance} />
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
        </form>
      </ModalContent>
    </FormProvider>
  );
};
