import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import { useContext } from "react";
import { FormProvider } from "react-hook-form";

import { FormValues } from "./SelectApproversFormPage";
import colors from "../../../style/colors";
import { parsePkh } from "../../../types/Address";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch } from "../../../utils/redux/hooks";
import { multisigActions } from "../../../utils/redux/slices/multisigsSlice";
import { OwnedImplicitAccountsAutocomplete } from "../../AddressAutocomplete";
import { AddressTile } from "../../AddressTile/AddressTile";
import { DynamicModalContext } from "../../DynamicModal";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader } from "../SignPageHeader";
import { SuccessStep } from "../SuccessStep";
import { SignPageProps, useSignPageHelpers } from "../utils";

export const SignTransactionFormPage: React.FC<SignPageProps<FormValues>> = props => {
  const dispatch = useAppDispatch();
  const { openWith } = useContext(DynamicModalContext);
  const { isLoading: contractNameObtainingIsLoading, handleAsyncAction } = useAsyncActionHandler();

  const {
    mode,
    operations: initialOperations,
    fee: initialFee,
    data: { threshold, signers, name },
  } = props;

  const {
    fee,
    operations,
    estimationFailed,
    isLoading: contractCreationIsLoading,
    form,
    reEstimate,
    signer,
    onSign: originateContract,
  } = useSignPageHelpers(initialFee, initialOperations, mode);

  const isLoading = contractNameObtainingIsLoading || contractCreationIsLoading;
  /**
   * To save the multisig account name we need to know the contract address
   * We don't know it until after we successfully originated the contract
   * Once we obtained it we can save the mapping between
   * the contract address and its chosen label
   */
  const onSign = (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(async () => {
      const operation = await originateContract(tezosToolkit);

      if (!operation) {
        /**
         * In case the operation was successfully originated, but we couldn't
         * fetch the contract address, we won't assign the provided label and
         * the contract will appear with a default label
         */
        throw new Error("An error occurred during contract origination");
      }

      const pkh = (await operation.getOriginatedContractAddresses())[0];

      dispatch(multisigActions.addMultisigLabel({ pkh, label: name }));
      return openWith(<SuccessStep hash={operation.opHash} />);
    });

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader
            {...props}
            description="Please review the details and then continue to submit contract."
            operationsType={operations.type}
            signer={signer}
            title="Review & Submit"
          />
          <ModalBody>
            <Text
              marginBottom="24px"
              padding="14px"
              color={colors.gray[50]}
              background={colors.gray[800]}
              borderRadius="6px"
              data-testid="contract-name"
            >
              {name}
            </Text>

            <FormLabel>Approvers</FormLabel>
            <Box marginBottom="12px" data-testid="approvers">
              {signers.map(signer => (
                <AddressTile
                  key={signer.val}
                  address={parsePkh(signer.val)}
                  data-testid={`approver-${signer.val}`}
                />
              ))}
            </Box>
            <Flex justifyContent="flex-end">
              <Threshold signersAmount={signers.length} threshold={threshold} />
            </Flex>

            <Box>
              <FormControl marginTop="24px" marginBottom="12px">
                <OwnedImplicitAccountsAutocomplete
                  allowUnknown={false}
                  inputName="signer"
                  isLoading={isLoading}
                  keepValid
                  label="Creation Fee Payer"
                  onUpdate={reEstimate}
                />
              </FormControl>
              <Flex justifyContent="flex-end">
                <SignPageFee fee={fee} />
              </Flex>
            </Box>
          </ModalBody>

          <ModalFooter>
            <SignButton
              isDisabled={estimationFailed}
              isLoading={isLoading}
              onSubmit={onSign}
              signer={signer}
              text="Submit Contract"
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

const Threshold: React.FC<{ threshold: number; signersAmount: number }> = ({
  threshold,
  signersAmount,
}) => (
  <Flex alignItems="center" data-testid="threshold">
    <Heading marginRight="4px" color={colors.gray[450]} size="sm">
      No. of approvals:
    </Heading>
    <Text color={colors.gray[400]} size="sm">
      {`${threshold} out of ${signersAmount}`}
    </Text>
  </Flex>
);
