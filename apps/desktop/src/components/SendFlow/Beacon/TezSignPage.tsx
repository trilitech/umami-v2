import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { type TezTransfer } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { type BeaconSignPageProps } from "./BeaconSignPageProps";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { headerText } from "../SignPageHeader";

export const TezSignPage = ({ operation, message }: BeaconSignPageProps) => {
  const { amount: mutezAmount, recipient } = operation.operations[0] as TezTransfer;

  const { isSigning, onSign, network, fee, form } = useSignWithBeacon(operation, message);

  return (
    <FormProvider {...form}>
      <ModalContent data-testid="TezSignPage">
        <form>
          <Header message={message} mode="single" operation={operation} />
          <ModalBody>
            <TezTile mutezAmount={mutezAmount} />

            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel marginTop="24px">From </FormLabel>
            <AddressTile address={operation.sender.address} />

            <FormLabel marginTop="24px">To </FormLabel>
            <AddressTile address={recipient} />

            <AdvancedSettingsAccordion />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isSigning}
              network={network}
              onSubmit={onSign}
              signer={operation.signer}
              text={headerText(operation.type, "single")}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
