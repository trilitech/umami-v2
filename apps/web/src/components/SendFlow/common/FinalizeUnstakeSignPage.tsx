import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { useAccountTotalFinalizableUnstakeAmount } from "@umami/state";
import { FormProvider, useForm } from "react-hook-form";

import { Header } from "./Header";
import { AddressTile } from "../../AddressTile/AddressTile";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { type CalculatedSignProps, type SdkSignPageProps } from "../utils";

export const FinalizeUnstakeSignPage = ({
  operation,
  headerProps,
  isSigning,
  onSign,
  network,
  fee,
}: SdkSignPageProps & CalculatedSignProps) => {
  const form = useForm({ defaultValues: { executeParams: operation.estimates } });
  const totalFinalizableAmount = useAccountTotalFinalizableUnstakeAmount(
    operation.signer.address.pkh
  );
  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <Header headerProps={headerProps} />
          <ModalBody>
            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel marginTop="24px">From</FormLabel>
            <AddressTile address={operation.sender.address} />

            <FormLabel marginTop="24px">Finalize Unstake</FormLabel>
            <TezTile mutezAmount={totalFinalizableAmount} />
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
