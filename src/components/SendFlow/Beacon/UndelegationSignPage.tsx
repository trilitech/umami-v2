import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";

import { BeaconSignPageProps } from "./BeaconSignPageProps";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { AddressTile } from "../../AddressTile/AddressTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { headerText } from "../SignPageHeader";

export const UndelegationSignPage: React.FC<BeaconSignPageProps> = ({
  operation,
  fee,
  message,
}) => {
  const { isSigning, onSign, network } = useSignWithBeacon(operation, message);

  return (
    <ModalContent>
      <form>
        <Header message={message} mode="single" operation={operation} />
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
            network={network}
            onSubmit={onSign}
            signer={operation.signer}
            text={headerText(operation.type, "single")}
          />
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
