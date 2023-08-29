import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { parseContractPkh, parsePkh, RawPkh } from "../../../types/Address";
import { FA12Transfer, FA2Transfer } from "../../../types/Operation";
import { KnownAccountsAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import {
  formDefaultValues,
  FormPagePropsWithSender,
  FormSubmitButtons,
  getSmallestUnit,
  makeValidateDecimals,
} from "../utils";
import SignPage from "./SignPage";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import {
  FA12TokenBalance,
  FA2TokenBalance,
  formatTokenAmount,
  getRealAmount,
  tokenDecimals,
  tokenSymbol,
} from "../../../types/TokenBalance";
import FormPageHeader from "../FormPageHeader";
import { FormErrorMessage } from "../../FormErrorMessage";

export type FormValues = {
  sender: RawPkh;
  recipient: RawPkh;
  prettyAmount: string;
};

export type FATokenBalance = FA12TokenBalance | FA2TokenBalance;

const toOperation =
  (token: FATokenBalance) =>
  (formValues: FormValues): FA12Transfer | FA2Transfer => {
    const fa2Operation: FA2Transfer = {
      type: "fa2",
      sender: parsePkh(formValues.sender),
      recipient: parsePkh(formValues.recipient),
      contract: parseContractPkh(token.contract),
      tokenId: token.tokenId,
      amount: getRealAmount(token, formValues.prettyAmount).toString(),
    };

    if (token.type === "fa2") {
      return fa2Operation;
    }

    return { ...fa2Operation, type: "fa1.2", tokenId: "0" };
  };

const FormPage: React.FC<
  FormPagePropsWithSender<FormValues> & { token: FATokenBalance }
> = props => {
  const { token } = props;
  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: { token },
    FormPage,
    defaultFormPageProps: props,
    toOperation: toOperation(token),
  });

  const addToBatch = useAddToBatchFormAction(toOperation(token));

  const {
    onFormSubmitActionHandlers: [onSingleSubmit, onBatchSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: formDefaultValues(props),
  });
  const {
    formState: { isValid, errors },
    register,
    handleSubmit,
  } = form;

  const decimals = tokenDecimals(token);
  const prettyBalance = formatTokenAmount(token.balance, decimals);
  const smallestUnit = getSmallestUnit(Number(decimals));

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <FormPageHeader />
          <ModalBody>
            <FormControl mt={3} mb={7} isInvalid={!!errors.prettyAmount}>
              <FormLabel>Amount</FormLabel>
              <InputGroup>
                <Input
                  isDisabled={isLoading}
                  type="number"
                  step={smallestUnit}
                  variant="filled"
                  {...register("prettyAmount", {
                    required: "Amount is required",
                    max: {
                      value: prettyBalance.toString(),
                      message: `Max amount is ${prettyBalance}`,
                    },
                    validate: makeValidateDecimals(Number(decimals)),
                  })}
                  placeholder={smallestUnit}
                />
                <InputRightElement pr={3} data-testid="token-symbol">
                  {tokenSymbol(token)}
                </InputRightElement>
              </InputGroup>
              {errors.prettyAmount && (
                <FormErrorMessage data-testid="amount-error">
                  {errors.prettyAmount.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl my={5} isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                label="From"
                isDisabled={true}
                inputName="sender"
                allowUnknown={false}
              />
              {errors.sender && (
                <FormErrorMessage data-testid="from-error">
                  {errors.sender.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl my={3} isInvalid={!!errors.recipient}>
              <KnownAccountsAutocomplete label="To" inputName="recipient" allowUnknown />
              {errors.recipient && (
                <FormErrorMessage data-testid="recipient-error">
                  {errors.recipient.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <FormSubmitButtons
              isLoading={isLoading}
              isValid={isValid}
              onSingleSubmit={handleSubmit(onSingleSubmit)}
              onAddToBatch={handleSubmit(onBatchSubmit)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
export default FormPage;
