import { type TezTransfer } from "@umami/core";
import { prettyTezAmount } from "@umami/tezos";
import { FormProvider } from "react-hook-form";
import { Form, Text, XStack, YStack } from "tamagui";

import { ModalBackButton } from "../../ModalBackButton";
import { ModalCloseButton } from "../../ModalCloseButton";
import { SignButton } from "../SignButton";
import { type SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage = (props: SignPageProps) => {
  const { fee, operations, estimationFailed, isLoading, form, signer, onSign } = useSignPageHelpers(
    props.operations
  );

  const { amount: mutezAmount, recipient } = operations.operations[0] as TezTransfer;

  return (
    <FormProvider {...form}>
      <Form>
        <ModalCloseButton />
        <ModalBackButton goBack={props.goBack} />
        <YStack padding="$4" paddingTop="$10" space="$4">
          <Text fontSize="$6" fontWeight="bold">
            Sign Transaction
          </Text>

          <YStack space="$4">
            <YStack space="$2">
              <Text fontWeight="bold">Amount</Text>
              <Text>{prettyTezAmount(mutezAmount)}</Text>
              <XStack justifyContent="flex-end" marginTop="$3">
                <Text color="$gray11">Fee: {prettyTezAmount(fee)}</Text>
              </XStack>
            </YStack>

            <YStack space="$2">
              <Text fontWeight="bold">From</Text>
              <Text>{operations.sender.address.pkh}</Text>
            </YStack>

            <YStack space="$2">
              <Text fontWeight="bold">To</Text>
              <Text>{recipient.pkh}</Text>
            </YStack>
          </YStack>

          <XStack justifyContent="flex-end" marginTop="$4" space="$3">
            <SignButton
              isDisabled={estimationFailed}
              isLoading={isLoading}
              onSubmit={onSign}
              signer={signer}
            />
          </XStack>
        </YStack>
      </Form>
    </FormProvider>
  );
};
