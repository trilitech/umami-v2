import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  type FormPagePropsWithSender,
  FormSubmitButtons,
  formDefaultValues,
  makeValidateDecimals,
  useAddToBatchFormAction,
  useDynamicModalContext,
  useDynamicModalFormContext,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "@umami/components";
import {
  type FA12TokenBalance,
  type FA2TokenBalance,
  type FA2Transfer,
  type TokenTransfer,
  formatTokenAmount,
  getRealAmount,
  getSmallestUnit,
  tokenDecimals,
  tokenSymbolSafe,
} from "@umami/core";
import { useAllAccounts, useContactsForSelectedNetwork } from "@umami/state";
import { type RawPkh, parseContractPkh, parsePkh } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import { RecipientsPage } from "./RecipientsPage";
import { SignTokensPage } from "./SignTokensPage";
import { ModalCloseButton } from "../../components/ModalCloseButton";

type FormValues = {
  sender: RawPkh;
  recipient: RawPkh;
  prettyAmount: string;
};

export const SendTokensFormPage = (
  props: FormPagePropsWithSender<FormValues> & { token: FA12TokenBalance | FA2TokenBalance }
) => {
  const decimals = tokenDecimals(props.token);
  const smallestUnit = getSmallestUnit(Number(decimals));
  const prettyBalance = formatTokenAmount(props.token.balance, decimals);
  const { openWith } = useDynamicModalContext();
  const addressPlaceholderText = useBreakpointValue({
    base: "Enter address or select",
    ls: "Enter address or select from contacts",
  });
  const { formState, setFormState } = useDynamicModalFormContext();

  const { token } = props;

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: formState.current ?? formDefaultValues(props),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const contacts = useContactsForSelectedNetwork();

  const accounts = useAllAccounts().map(account => ({
    name: account.label,
    pkh: account.address.pkh,
    address: account.address,
  }));

  const openSignPage = useOpenSignPageFormAction({
    SignPage: SignTokensPage,
    signPageExtraData: { token },
    FormPage: SendTokensFormPage,
    defaultFormPageProps: props,
    toOperation: toOperation(token),
  });

  const addToBatch = useAddToBatchFormAction(toOperation(token));

  const {
    onFormSubmitActionHandlers: [onSingleSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

  return (
    <FormProvider {...form}>
      <ModalContent
        minWidth={{
          lg: "520px",
        }}
      >
        <ModalHeader>
          Send
          <ModalCloseButton />
        </ModalHeader>
        <form>
          <ModalBody>
            <Stack gap="24px" width="full">
              <FormControl isInvalid={!!errors.prettyAmount}>
                <FormLabel>Amount</FormLabel>
                <InputGroup>
                  <Input
                    placeholder={smallestUnit}
                    type="number"
                    {...register("prettyAmount", {
                      required: "Amount is required",
                      max: {
                        value: prettyBalance.toString(),
                        message: `Max amount is ${prettyBalance}`,
                      },
                      validate: makeValidateDecimals(Number(decimals)),
                    })}
                  ></Input>
                  <InputRightElement paddingRight="12px">
                    {tokenSymbolSafe(props.token)}
                  </InputRightElement>
                </InputGroup>
                {errors.prettyAmount && (
                  <FormErrorMessage>{errors.prettyAmount.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.recipient}>
                <FormLabel>To</FormLabel>
                <InputGroup>
                  <Input
                    placeholder={addressPlaceholderText}
                    variant="filled"
                    {...register("recipient", { required: "Recipient is required" })}
                  />
                  <InputRightElement paddingRight="10px">
                    <Button
                      onClick={async () => {
                        setFormState(form.getValues());
                        await openWith(<RecipientsPage accounts={[...contacts, ...accounts]} />);
                      }}
                      variant="inputElement"
                    >
                      Select
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.recipient && (
                  <FormErrorMessage>{errors.recipient.message}</FormErrorMessage>
                )}
              </FormControl>
            </Stack>
          </ModalBody>
        </form>
        <ModalFooter>
          <FormSubmitButtons
            isLoading={isLoading}
            isValid={isValid}
            onSingleSubmit={handleSubmit(onSingleSubmit)}
          />
        </ModalFooter>
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
