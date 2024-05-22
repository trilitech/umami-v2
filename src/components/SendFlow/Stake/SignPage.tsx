import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";

import { TezTransfer } from "../../../types/Operation";
import { AddressTile } from "../../AddressTile/AddressTile";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage: React.FC<SignPageProps> = props => {
  const { mode, operations: initialOperations, fee: initialFee } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);

  const { amount: mutezAmount, recipient } = operations.operations[0] as TezTransfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} signer={operations.signer} />
          <ModalBody>
            <FormLabel marginTop="24px">From</FormLabel>
            <AddressTile address={operations.sender.address} />

            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel marginTop="24px">Stake amount</FormLabel>
            <TezTile mutezAmount={mutezAmount} />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isDisabled={estimationFailed}
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
