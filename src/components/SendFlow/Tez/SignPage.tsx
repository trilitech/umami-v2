import {
  Flex,
  FormControl,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import colors from "../../../style/colors";
import { TezOperation } from "../../../types/Operation";
import { OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import SignButton from "../../sendForm/components/SignButton";
import { FormOperations } from "../../sendForm/types";
import { BigNumber } from "bignumber.js";
import { mutezToPrettyTez, SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { sumTez } from "../../../utils/tezos";
import { OperationSignerSelector } from "../OperationSignerSelector";
import { prettyTezAmount } from "../../../utils/format";

export const getTezAmount = (operations: FormOperations): BigNumber | undefined => {
  switch (operations.type) {
    // for proposal operations the signer pays only the operation fee
    // tez will be sent by the multisig contract on execute call
    case "proposal":
      return;
    case "implicit": {
      const amounts = operations.content
        .filter((op): op is TezOperation => op.type === "tez")
        .map(op => op.amount);
      return sumTez(amounts);
    }
  }
};

const SignPage: React.FC<SignPageProps> = props => {
  const { mode, operations: initialOperations, fee: initialFee } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);

  const tezAmount = getTezAmount(operations);

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            {/* TODO: Import icon and adjust text size */}
            {tezAmount && (
              <Flex
                h="60px"
                w="100%"
                borderRadius="4px"
                bg={colors.gray[800]}
                alignItems="center"
                px={2}
                py={3}
              >
                <Heading size="sm">{prettyTezAmount(tezAmount).toString()}</Heading>
              </Flex>
            )}

            {/* TODO: Come up with a better way to show the fee when tezAmount === null (e.g. proposal) */}
            <Flex my={3} alignItems="center" justifyContent="end" px={1}>
              <Flex>
                <Text size="sm" mr={1} color={colors.gray[450]}>
                  Fee:
                </Text>
                <Text size="sm" data-testid="fee" color={colors.gray[400]}>
                  {mutezToPrettyTez(fee)}
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
