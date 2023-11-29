import {
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import { RawPkh, parseImplicitPkh, parsePkh } from "../../../types/Address";
import { Delegation } from "../../../types/Operation";
import { BakersAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { FormErrorMessage } from "../../FormErrorMessage";
import { HeaderWrapper } from "../FormPageHeader";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { FormPageProps, FormSubmitButtons, formDefaultValues } from "../utils";

export type FormValues = {
  sender: RawPkh;
  baker: RawPkh;
};

export const FormPage: React.FC<FormPageProps<FormValues>> = props => {
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
    onFormSubmitActionHandlers: [onSingleSubmit, onBatchSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: formDefaultValues(props),
  });

  const {
    formState: { isValid, errors },
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <HeaderWrapper>
            <Text fontWeight="600" size="2xl">
              {baker ? "Change Baker" : "Delegate"}
            </Text>
            <ModalCloseButton />
          </HeaderWrapper>

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

const toOperation = (formValues: FormValues): Delegation => ({
  type: "delegation",
  sender: parsePkh(formValues.sender),
  recipient: parseImplicitPkh(formValues.baker),
});
