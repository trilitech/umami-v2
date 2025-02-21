import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { type Stake, Titles } from "@umami/core";
import { FormProvider, useForm } from "react-hook-form";

import { Header } from "./Header";
import { AddressTile } from "../../AddressTile/AddressTile";
import { TezTile } from "../../AssetTiles/TezTile";
import { HintsAccordion } from "../../HintsAccordion";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { type CalculatedSignProps, type SdkSignPageProps } from "../utils";

export const StakeSignPage = ({
  operation,
  headerProps,
  isSigning,
  onSign,
  network,
  fee,
}: SdkSignPageProps & CalculatedSignProps) => {
  const { amount: mutezAmount } = operation.operations[0] as Stake;

  const form = useForm({ defaultValues: { executeParams: operation.estimates } });

  return (
    <FormProvider {...form}>
      <ModalContent data-testid="StakeSignPage">
        <form>
          <Header headerProps={headerProps} title={Titles.StakeSignPage} />
          <HintsAccordion signPage="StakeSignPage" />
          <ModalBody>
            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel marginTop="24px">From</FormLabel>
            <AddressTile address={operation.sender.address} />

            <FormLabel marginTop="24px">Stake</FormLabel>
            <TezTile mutezAmount={mutezAmount} />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isSigning}
              network={network}
              onSubmit={onSign}
              signer={operation.signer}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
