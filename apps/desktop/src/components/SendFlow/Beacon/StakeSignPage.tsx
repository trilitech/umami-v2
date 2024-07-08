import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { type Stake } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { type BeaconSignPageProps } from "./BeaconSignPageProps";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { AddressTile } from "../../AddressTile/AddressTile";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { headerText } from "../SignPageHeader";

export const StakeSignPage = ({ operation, message }: BeaconSignPageProps) => {
  const { amount: mutezAmount } = operation.operations[0] as Stake;

  const { isSigning, onSign, network, fee, form } = useSignWithBeacon(operation, message);

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <Header message={message} mode="single" operation={operation} />
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
              text={headerText(operation.type, "single")}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
