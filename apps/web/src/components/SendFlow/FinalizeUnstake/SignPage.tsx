import {
  Center,
  Flex,
  FormLabel,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import type BigNumber from "bignumber.js";
import { FormProvider } from "react-hook-form";

import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { type SignPageProps, useSignPageHelpers } from "../utils";

// TODO: test
export const SignPage = (props: SignPageProps<{ finalizableAmount: BigNumber }>) => {
  const {
    operations,
    data: { finalizableAmount },
  } = props;
  const { isLoading, form, signer, onSign, fee } = useSignPageHelpers(operations);

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <ModalHeader>
            <Center>
              <Heading>Finalize</Heading>
            </Center>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <FormLabel marginTop="24px">From</FormLabel>
            <AddressTile address={operations.sender.address} />

            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel marginTop="24px">Withdraw</FormLabel>
            <TezTile mutezAmount={finalizableAmount} />

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
