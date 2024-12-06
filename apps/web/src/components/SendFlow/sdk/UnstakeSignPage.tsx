import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { type Unstake } from "@umami/core";
import { FormProvider, useForm } from "react-hook-form";

import { Header } from "./Header";
import { AddressTile } from "../../AddressTile/AddressTile";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { type CalculatedSignProps, type SdkSignPageProps } from "../utils";

export const UnstakeSignPage = ({
  operation,
  headerProps,
  isSigning,
  onSign,
  network,
  fee,
}: SdkSignPageProps & CalculatedSignProps) => {
  const { amount: mutezAmount } = operation.operations[0] as Unstake;

  const form = useForm({ defaultValues: { executeParams: operation.estimates } });

  return (
    <FormProvider {...form}>
      <ModalContent data-testid="UnstakeSignPage">
        <form>
          <Header headerProps={headerProps} />
          <ModalBody>
            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel marginTop="24px">From</FormLabel>
            <AddressTile address={operation.sender.address} />

            <FormLabel marginTop="24px">Unstake</FormLabel>
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
