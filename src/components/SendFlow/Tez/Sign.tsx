import {
  Box,
  Divider,
  Flex,
  FormControl,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import colors from "../../../style/colors";
import { TezOperation } from "../../../types/Operation";
import { useTezToDollar } from "../../../utils/hooks/assetsHooks";
import { getTotal } from "../../../views/batch/batchUtils";
import { AvailableSignersAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import SignButton from "../../sendForm/components/SignButton";
import { FormOperations } from "../../sendForm/types";
import { BigNumber } from "bignumber.js";
import { mutezToTez } from "../../../utils/format";
import { mutezToPrettyTez, SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";

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
      return getTotal(amounts);
    }
  }
};

const SignPage: React.FC<SignPageProps> = props => {
  const { mode, operations: initialOperations, fee: initialFee } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);
  const convertTezToDallars = useTezToDollar();

  const tezAmount = getTezAmount(operations);
  const totalCost = fee.plus(tezAmount ?? 0);
  const totalCostInUSD = convertTezToDallars(mutezToTez(totalCost));

  return (
    <FormProvider {...form}>
      <ModalContent bg={colors.gray[900]} borderColor={colors.gray[700]} borderRadius="8px">
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            <FormControl mb="24px">
              <OwnedAccountsAutocomplete
                inputName="sender"
                label="From"
                allowUnknown={false}
                isDisabled
              />
            </FormControl>

            {tezAmount && (
              <Flex justifyContent="space-between">
                <Text size="sm" color={colors.gray[450]} fontWeight="600">
                  Tez Amount:
                </Text>
                <Text size="sm" color={colors.gray[400]}>
                  {mutezToPrettyTez(tezAmount)}
                </Text>
              </Flex>
            )}

            <Flex justifyContent="space-between" mb={3}>
              <Text size="sm" color={colors.gray[450]} fontWeight="600">
                Fee:
              </Text>
              <Text size="sm" data-testid="fee" color={colors.gray[400]}>
                {mutezToPrettyTez(fee)}
              </Text>
            </Flex>

            <Divider />

            <Flex justifyContent="space-between" mb={3}>
              <Text color={colors.gray[400]} fontWeight="600">
                Total:
              </Text>
              <Box>
                <Text color="white" fontWeight="600">
                  {mutezToPrettyTez(totalCost)}
                </Text>
                {totalCostInUSD && (
                  <Box textAlign="right">
                    <Text color={colors.gray[450]} fontWeight="600" display="inline">
                      USD:
                    </Text>
                    <Text color={colors.gray[400]} display="inline">
                      {` ${totalCostInUSD.toFixed(2)}$`}
                    </Text>
                  </Box>
                )}
              </Box>
            </Flex>

            {initialOperations.type === "proposal" && (
              <FormControl>
                <AvailableSignersAutocomplete
                  account={initialOperations.sender}
                  inputName="signer"
                  label="Select Proposer"
                  isDisabled={isLoading}
                  onUpdate={reEstimate}
                  keepValid
                />
              </FormControl>
            )}
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
