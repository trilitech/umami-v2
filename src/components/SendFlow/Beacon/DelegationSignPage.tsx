import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";

import { BeaconSignPageProps } from "./BeaconSignPageProps";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { Delegation } from "../../../types/Operation";
import { AddressTile } from "../../AddressTile/AddressTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { headerText } from "../SignPageHeader";

export const DelegationSignPage: React.FC<BeaconSignPageProps> = ({ operation, fee, message }) => {
  const { recipient } = operation.operations[0] as Delegation;

  const { isSigning, onSign } = useSignWithBeacon(operation, message);

  return (
    <ModalContent>
      <form>
        <Header message={message} mode="single" operation={operation} />
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
  );
};
