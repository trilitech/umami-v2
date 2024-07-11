import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import {
  type Account,
  type FA12TokenBalance,
  type FA2TokenBalance,
  formatTokenAmount,
  getSmallestUnit,
  tokenDecimals,
  tokenSymbolSafe,
} from "@umami/core";
import { useAllAccounts, useContactsForSelectedNetwork } from "@umami/state";
import { type RawPkh } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import { RecipientsPage } from "./RecipientsPage";

export type FormPageProps<T> = { sender?: Account; form?: T };

export const formDefaultValues = <T,>({ sender, form }: FormPageProps<T>) => {
  if (form) {
    return form;
  } else if (sender) {
    return { sender: sender.address.pkh };
  } else {
    return {};
  }
};

export const makeValidateDecimals = (decimals: number) => (val: string) => {
  if (val.includes(".")) {
    const decimalPart = val.split(".")[1];
    if (decimalPart.length > decimals) {
      return `Please enter a value with up to ${decimals} decimal places`;
    }
  }
  return true;
};

type SendTokensFormProps = { account: Account; token: FA12TokenBalance | FA2TokenBalance };
type FormValues = {
  sender: RawPkh;
  recipient: RawPkh;
  prettyAmount: string;
};

type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

type FormPagePropsWithSender<T> = RequiredFields<FormPageProps<T>, "sender">;

export const SendTokensFormPage = (
  props: FormPagePropsWithSender<FormValues> & { token: FA12TokenBalance | FA2TokenBalance }
) => {
  const decimals = tokenDecimals(props.token);
  const smallestUnit = getSmallestUnit(Number(decimals));
  const prettyBalance = formatTokenAmount(props.token.balance, decimals);
  const { openWith, onClose } = useDynamicModalContext();
  const addressPlaceholderText = useBreakpointValue({
    base: "Enter address or select",
    ls: "Enter address or select from contacts",
  });

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: formDefaultValues(props),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = form;

  const contacts = useContactsForSelectedNetwork();

  const accounts = useAllAccounts().map(account => ({
    name: account.label,
    pkh: account.address.pkh,
  }));

  return (
    <FormProvider {...form}>
      <ModalContent>
        <ModalHeader>
          Send
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody>
          <Stack width="full">
            <form>
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
                      onClick={() =>
                        openWith(
                          <RecipientsPage
                            accounts={[...contacts, ...accounts]}
                            onSelect={value => setValue("recipient", value)}
                          />
                        )
                      }
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
            </form>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            width="full"
            isDisabled={!isValid}
            onClick={handleSubmit(() => console.log("submit"))}
            rounded="full"
            variant="primary"
          >
            Preview
          </Button>
        </ModalFooter>
      </ModalContent>
    </FormProvider>
  );
};
