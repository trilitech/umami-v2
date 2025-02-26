import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import hj from "@hotjar/browser";
import {
  type FA12TokenBalance,
  type FA2TokenBalance,
  type FA2Transfer,
  type TokenTransfer,
  formatTokenAmount,
  getRealAmount,
  tokenDecimals,
  tokenSymbolSafe,
} from "@umami/core";
import { type RawPkh, parseContractPkh, parsePkh } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import { KnownAccountsAutocomplete } from "../../AddressAutocomplete";
import { TokenTile } from "../../AssetTiles";
import { FormPageHeader } from "../FormPageHeader";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import {
  type FormPagePropsWithSender,
  FormSubmitButton,
  formDefaultValues,
  getSmallestUnit,
  makeValidateDecimals,
} from "../utils";

export type FormValues = {
  sender: RawPkh;
  recipient: RawPkh;
  prettyAmount: string;
};

export const FormPage = (
  props: FormPagePropsWithSender<FormValues> & { token: FA12TokenBalance | FA2TokenBalance }
) => {
  const { token } = props;
  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: { token },
    FormPage,
    defaultFormPageProps: props,
    toOperation: toOperation(token),
  });

  const addToBatch = useAddToBatchFormAction(toOperation(token));

  hj.stateChange("send_flow/token_form_page");

  const {
    onFormSubmitActionHandlers: [onSingleSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: formDefaultValues(props),
  });
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = form;

  const decimals = tokenDecimals(token);
  const prettyBalance = formatTokenAmount(token.balance, decimals);
  const smallestUnit = getSmallestUnit(Number(decimals));

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSingleSubmit)}>
          <FormPageHeader />
          <ModalBody gap="24px">
            <FormControl data-testid="available-balance">
              <FormLabel>Available balance</FormLabel>
              <TokenTile amount={token.balance} token={token} />
            </FormControl>
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
            <FormControl isInvalid={!!errors.recipient}>
              <KnownAccountsAutocomplete allowUnknown inputName="recipient" label="To" />
              {errors.recipient && (
                <FormErrorMessage data-testid="recipient-error">
                  {errors.recipient.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <FormSubmitButton isLoading={isLoading} />
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
