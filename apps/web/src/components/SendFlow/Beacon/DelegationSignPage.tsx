import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { type Delegation } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { type BeaconSignPageProps } from "./BeaconSignPageProps";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";

export const DelegationSignPage = ({ operation, message }: BeaconSignPageProps) => {
  const { recipient } = operation.operations[0] as Delegation;

  const { isSigning, onSign, network, fee, form } = useSignWithBeacon(operation, message);

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <Header message={message} />
          <ModalBody>
            <FormLabel>From</FormLabel>
            <AddressTile address={operation.signer.address} />

            <Flex
              alignItems="center"
              justifyContent="end"
              marginTop="12px"
              marginBottom="24px"
              paddingX="4px"
            >
              <Flex alignItems="center">
                <SignPageFee fee={fee} />
              </Flex>
            </Flex>

            <FormLabel>To</FormLabel>
            <AddressTile address={recipient} />

            <AdvancedSettingsAccordion />
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
