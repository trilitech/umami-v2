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
import BigNumber from "bignumber.js";
import { FormProvider } from "react-hook-form";

import { AddressTile } from "../../AddressTile/AddressTile";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { headerText } from "../SignPageHeader";
import { SignPageProps, useSignPageHelpers } from "../utils";

// TODO: test
export const SignPage: React.FC<SignPageProps<{ finalizableAmount: BigNumber }>> = props => {
  const {
    mode,
    operations,
    fee,
    data: { finalizableAmount },
  } = props;
  const { isLoading, form, signer, onSign } = useSignPageHelpers(fee, operations, mode);

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
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isLoading}
              onSubmit={onSign}
              signer={signer}
              text={headerText(operations.type, mode)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
