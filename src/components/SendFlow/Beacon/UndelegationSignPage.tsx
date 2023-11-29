import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";

import { BeaconSignPageProps } from "./BeaconSignPage";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { AddressTile } from "../../AddressTile/AddressTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader, headerText } from "../SignPageHeader";

export const UndelegationSignPage: React.FC<BeaconSignPageProps> = ({
  operation,
  onBeaconSuccess,
}) => {
  const { isSigning, form, onSign, fee } = useSignWithBeacon(operation, onBeaconSuccess);

  if (!fee) {
    return null;
  }

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader mode="single" operationsType={operation.type} />
          <ModalBody>
            <FormLabel>From</FormLabel>
            <AddressTile address={operation.signer.address} />

            <Flex alignItems="center" justifyContent="end" marginTop="12px" paddingX="4px">
              <SignPageFee fee={fee} />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isSigning}
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
