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

import { SignPage } from "./SignPage";
import { RawPkh, parseContractPkh, parsePkh } from "../../../types/Address";
import { FA2Transfer, TokenTransfer } from "../../../types/Operation";
import {
  formatTokenAmount,
  getRealAmount,
  tokenDecimals,
  tokenSymbolSafe,
} from "../../../types/Token";
import { FA12TokenBalance, FA2TokenBalance } from "../../../types/TokenBalance";
import { KnownAccountsAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { FormErrorMessage } from "../../FormErrorMessage";
import { FormPageHeader } from "../FormPageHeader";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import {
  FormPagePropsWithSender,
  FormSubmitButtons,
  formDefaultValues,
  getSmallestUnit,
  makeValidateDecimals,
} from "../utils";

export type FormValues = {
  sender: RawPkh;
  recipient: RawPkh;
  prettyAmount: string;
};

export const FormPage: React.FC<
  FormPagePropsWithSender<FormValues> & { token: FA12TokenBalance | FA2TokenBalance }
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
            <FormControl isInvalid={!!errors.prettyAmount}>
              <FormLabel>Amount</FormLabel>
              <InputGroup>
                <Input
                  isDisabled={isLoading}
                  step={smallestUnit}
                  type="number"
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
                <InputRightElement paddingRight="12px" data-testid="token-symbol">
                  {tokenSymbolSafe(token)}
                </InputRightElement>
              </InputGroup>
              {errors.prettyAmount && (
                <FormErrorMessage data-testid="amount-error">
                  {errors.prettyAmount.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl marginTop="24px" isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                allowUnknown={false}
                inputName="sender"
                isDisabled={true}
                label="From"
              />
              {errors.sender && (
                <FormErrorMessage data-testid="from-error">
                  {errors.sender.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl marginTop="24px" isInvalid={!!errors.recipient}>
              <KnownAccountsAutocomplete allowUnknown inputName="recipient" label="To" />
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
              onAddToBatch={handleSubmit(onBatchSubmit)}
              onSingleSubmit={handleSubmit(onSingleSubmit)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

const toOperation =
  (token: FA12TokenBalance | FA2TokenBalance) =>
  (formValues: FormValues): TokenTransfer => {
    const fa2Operation: FA2Transfer = {
      type: "fa2",
      sender: parsePkh(formValues.sender),
      recipient: parsePkh(formValues.recipient),
      contract: parseContractPkh(token.contract),
      tokenId: token.tokenId,
      amount: getRealAmount(token, formValues.prettyAmount),
    };

    if (token.type === "fa2") {
      return fa2Operation;
    }

    return { ...fa2Operation, type: "fa1.2", tokenId: "0" };
  };
