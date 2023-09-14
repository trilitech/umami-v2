import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { TezTransfer } from "../../../types/Operation";
import useSignWithBeacon from "./useSignWithBeacon";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { TezTile } from "../../AssetTiles/TezTile";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";
import SignButton from "../../sendForm/components/SignButton";
import { FormProvider } from "react-hook-form";
import { BeaconSignPageProps } from "./BeaconSignPage";

const TezSignPage: React.FC<BeaconSignPageProps> = ({ operation, onBeaconSuccess }) => {
  const { amount: mutezAmount, recipient } = operation.operations[0] as TezTransfer;

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
            <TezTile mutezAmount={mutezAmount} />

            <Flex mt="12px" alignItems="center" justifyContent="end">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel mt="24px">From </FormLabel>
            <AddressTile address={operation.sender.address} />

            <FormLabel mt="24px">To </FormLabel>
            <AddressTile address={recipient} />
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

export default TezSignPage;
