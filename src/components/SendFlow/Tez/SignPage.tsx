import { Flex, FormControl, ModalBody, ModalContent, ModalFooter, Text } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import colors from "../../../style/colors";
import { TezTransfer } from "../../../types/Operation";
import { OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import SignButton from "../../sendForm/components/SignButton";
import { SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { OperationSignerSelector } from "../OperationSignerSelector";
import { prettyTezAmount } from "../../../utils/format";
import { TezTile } from "../../AssetTiles/TezTile";

const SignPage: React.FC<SignPageProps> = props => {
  const { mode, operations: initialOperations, fee: initialFee } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);

  const tezAmount = (operations.operations[0] as TezTransfer).amount;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            <TezTile tezAmount={tezAmount} />

            <Flex my={3} alignItems="center" justifyContent="end">
              <Flex>
                <Text size="sm" mr={1} color={colors.gray[450]}>
                  Fee:
                </Text>
                <Text size="sm" data-testid="fee" color={colors.gray[400]}>
                  {prettyTezAmount(fee)}
                </Text>
              </Flex>
            </Flex>

            {/* TODO: Add sender address tile */}
            <FormControl mb="24px">
              <OwnedAccountsAutocomplete
                inputName="sender"
                label="From"
                allowUnknown={false}
                isDisabled
              />
            </FormControl>

            {/* TODO: Add recipient address tile */}

            <OperationSignerSelector
              sender={operations.sender}
              isDisabled={isLoading}
              operationType={operations.type}
              reEstimate={reEstimate}
            />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isLoading}
              isDisabled={estimationFailed}
              signer={signer}
              onSubmit={onSign}
              text={headerText(operations.type, mode)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
export default SignPage;
