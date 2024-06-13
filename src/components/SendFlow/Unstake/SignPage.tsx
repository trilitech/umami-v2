import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";

import { Unstake } from "../../../types/Operation";
import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { SignPageProps, useSignPageHelpers } from "../utils";
// TODO: test
export const SignPage: React.FC<SignPageProps<{ stakedBalance: number }>> = props => {
  const {
    mode,
    operations,
    data: { stakedBalance },
  } = props;
  const { isLoading, form, signer, onSign, fee } = useSignPageHelpers(operations, mode);
  const { amount: mutezAmount } = operations.operations[0] as Unstake;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} signer={operations.signer} />
          <ModalBody>
            <FormLabel marginTop="24px">From</FormLabel>
            <AddressTile address={operations.sender.address} />

            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel marginTop="24px">Stake amount</FormLabel>
            <TezTile mutezAmount={stakedBalance} />

            <FormLabel marginTop="24px">Amount to Unstake</FormLabel>
            <TezTile mutezAmount={mutezAmount} />

            <AdvancedSettingsAccordion />
          </ModalBody>
          <ModalFooter>
            <SignButton
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
