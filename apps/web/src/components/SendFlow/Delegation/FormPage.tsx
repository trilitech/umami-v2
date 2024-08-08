import {
  FormControl,
  FormErrorMessage,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { type Delegation } from "@umami/core";
import { type RawPkh, parseImplicitPkh, parsePkh } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import { BakersAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { type FormPageProps, FormSubmitButton, formDefaultValues } from "../utils";

export type FormValues = {
  sender: RawPkh;
  baker: RawPkh;
};

export const FormPage = (props: FormPageProps<FormValues>) => {
  const baker = props.form?.baker;

  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: undefined,
    FormPage,
    defaultFormPageProps: props,
    toOperation,
  });

  const addToBatch = useAddToBatchFormAction(toOperation);

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
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form data-testid="delegate-form" onSubmit={handleSubmit(onSingleSubmit)}>
          <ModalHeader>
            <Text fontWeight="600" size="2xl">
              {baker ? "Change Baker" : "Delegate"}
            </Text>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <FormControl isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                allowUnknown={false}
                inputName="sender"
                isDisabled={!!props.sender}
                label="From"
              />
              {errors.sender && (
                <FormErrorMessage data-testid="from-error">
                  {errors.sender.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl marginTop="24px" data-testid="baker" isInvalid={!!errors.baker}>
              <BakersAutocomplete allowUnknown inputName="baker" label="Baker" />
              {errors.baker && <FormErrorMessage>{errors.baker.message}</FormErrorMessage>}
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

const toOperation = (formValues: FormValues): Delegation => ({
  type: "delegation",
  sender: parsePkh(formValues.sender),
  recipient: parseImplicitPkh(formValues.baker),
});
