import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";

import { type BeaconSignPageProps } from "./BeaconSignPageProps";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";

export const UndelegationSignPage = ({ operation, message }: BeaconSignPageProps) => {
  const { isSigning, onSign, network, form, fee } = useSignWithBeacon(operation, message);

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <Header message={message} />
          <ModalBody>
            <FormLabel>From</FormLabel>
            <AddressTile address={operation.signer.address} />

            <Flex alignItems="center" justifyContent="end" marginTop="12px" paddingX="4px">
              <SignPageFee fee={fee} />
            </Flex>

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
