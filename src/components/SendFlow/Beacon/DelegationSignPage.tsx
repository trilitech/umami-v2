import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { Delegation } from "../../../types/Operation";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { SignPageFee } from "../SignPageFee";
import { AddressTile } from "../../AddressTile/AddressTile";
import { FormProvider } from "react-hook-form";
import { BeaconSignPageProps } from "./BeaconSignPage";
import { SignButton } from "../SignButton";

export const DelegationSignPage: React.FC<BeaconSignPageProps> = ({
  operation,
  onBeaconSuccess,
}) => {
  const { recipient } = operation.operations[0] as Delegation;

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
