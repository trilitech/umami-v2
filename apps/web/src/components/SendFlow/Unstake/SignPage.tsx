import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { type Unstake } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader } from "../SignPageHeader";
import { type SignPageProps, useSignPageHelpers } from "../utils";
// TODO: test
export const SignPage = (props: SignPageProps<{ stakedBalance: number }>) => {
  const {
    operations,
    data: { stakedBalance },
  } = props;
  const { isLoading, form, signer, onSign, fee } = useSignPageHelpers(operations);
  const { amount: mutezAmount } = operations.operations[0] as Unstake;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader />
          <ModalBody>
            <FormLabel marginTop="24px">From</FormLabel>
            <AddressTile address={operations.sender.address} />

            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel marginTop="24px">Stake amount</FormLabel>
            <TezTile mutezAmount={stakedBalance} />

            <FormLabel marginTop="24px">Amount to unstake</FormLabel>
            <TezTile mutezAmount={mutezAmount} />

            <AdvancedSettingsAccordion />
          </ModalBody>
          <ModalFooter>
            <SignButton isLoading={isLoading} onSubmit={onSign} signer={signer} />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
