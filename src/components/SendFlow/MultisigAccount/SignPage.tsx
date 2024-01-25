import {
  Box,
  Center,
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
import { useAppDispatch } from "../../../utils/redux/hooks";
import { multisigActions } from "../../../utils/redux/slices/multisigsSlice";
import { OwnedImplicitAccountsAutocomplete } from "../../AddressAutocomplete";
import { AddressTile } from "../../AddressTile/AddressTile";
import { DynamicModalContext } from "../../DynamicModal";
import { FormErrorMessage } from "../../FormErrorMessage";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { SuccessStep } from "../SuccessStep";
import { SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage: React.FC<SignPageProps<FormValues>> = props => {
  const dispatch = useAppDispatch();
  const { openWith } = useContext(DynamicModalContext);

  const {
    mode,
    operations: initialOperations,
    fee: initialFee,
    data: { threshold, signers, name, sender },
  } = props;

  const {
    fee,
    operations,
    estimationFailed,
    isLoading,
    form,
    reEstimate,
    signer,
    onSign: originateContract,
    handleAsyncAction,
  } = useSignPageHelpers(initialFee, initialOperations, mode);

  const {
    formState: { errors },
  } = form;

  /**
   * To save the multisig account name we need to know the contract address
   * We don't know it until after we successfully originated the contract
   * Once we obtained it we can save the mapping between
   * the contract address and its chosen label
   */
  const onSign = async (tezosToolkit: TezosToolkit) =>
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
      openWith(<SuccessStep hash={operation.opHash} />);
    });

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} signer={operations.signer} />
          <ModalBody>
            <FormLabel>Contract Name</FormLabel>
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
            <Box data-testid="approvers">
              {signers.map(signer => {
                return (
                  <AddressTile
                    key={signer.val}
                    marginBottom="12px"
                    address={parsePkh(signer.val)}
                    data-testid={`approver-${signer.val}`}
                  />
                );
              })}
            </Box>

            <Flex alignItems="center" marginTop="24px" marginBottom="24px">
              <Heading marginRight="12px" size="md">
                Min No. of approvals:
              </Heading>
              <Center width="100px" height="48px" background={colors.gray[800]} borderRadius="4px">
                <Text textAlign="center" data-testid="threshold">
                  {threshold} out of {signers.length}
                </Text>
              </Center>
            </Flex>

            <Box marginBottom="24px">
              <FormControl isInvalid={!!errors.sender} marginY="24px">
                <OwnedImplicitAccountsAutocomplete
                  allowUnknown={false}
                  inputName="sender"
                  isLoading={isLoading}
                  keepValid
                  label="Creation Fee Payer"
                  onUpdate={reEstimate}
                />
                {errors.sender && (
                  <FormErrorMessage data-testid="owner-error">
                    {errors.sender.message}
                  </FormErrorMessage>
                )}
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
              text={headerText(operations.type, mode)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
