import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import useSignWithBeacon from "./useSignWithBeacon";
import { SignPageHeader, headerText } from "../SignPageHeader";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";
import SignButton from "../../sendForm/components/SignButton";
import { FormProvider } from "react-hook-form";
import { BeaconSignPageProps } from "./BeaconSignPage";

const UndelegationSignPage: React.FC<BeaconSignPageProps> = ({ operation, onBeaconSuccess }) => {
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

            <Flex mt="12px" alignItems="center" justifyContent="end" px="4px">
              <SignPageFee fee={fee} />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isSigning}
              signer={operation.signer}
              onSubmit={onSign}
              text={headerText(operation.type, "single")}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

export default UndelegationSignPage;
