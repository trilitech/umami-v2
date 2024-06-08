import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";

import { BeaconSignPageProps } from "./BeaconSignPageProps";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { useAccountTotalFinalizableUnstakeAmount } from "../../../utils/hooks/stakingHooks";
import { AddressTile } from "../../AddressTile/AddressTile";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { headerText } from "../SignPageHeader";

export const FinalizeUnstakeSignPage: React.FC<BeaconSignPageProps> = ({
  operation,
  fee,
  message,
}) => {
  const { isSigning, onSign, network } = useSignWithBeacon(operation, message);
  const totalFinalizableAmount = useAccountTotalFinalizableUnstakeAmount(
    operation.signer.address.pkh
  );
  return (
    <ModalContent>
      <form>
        <Header message={message} mode="single" operation={operation} />
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
            text={headerText(operation.type, "single")}
          />
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
