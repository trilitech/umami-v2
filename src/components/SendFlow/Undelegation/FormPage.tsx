import { FormControl, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import { RawPkh, parsePkh } from "../../../types/Address";
import { Undelegation } from "../../../types/Operation";
import { OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { AddressTile } from "../../AddressTile/AddressTile";
import { FormPageHeader } from "../FormPageHeader";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { FormPagePropsWithSender, FormSubmitButtons, formDefaultValues } from "../utils";

export type FormValues = {
  sender: RawPkh;
  baker: RawPkh;
};

export const FormPage: React.FC<FormPagePropsWithSender<FormValues>> = props => {
  const { sender } = props;
  // it must always be passed in from the parent component
  const baker = props.form?.baker;

  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: undefined,
    FormPage,
    defaultFormPageProps: { sender },
    toOperation,
  });

  const addToBatch = useAddToBatchFormAction(toOperation);

  const {
    onFormSubmitActionHandlers: [onSingleSubmit, onBatchSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: formDefaultValues({ sender }),
  });

  const { handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <FormPageHeader
            subTitle="Select preview to end delegation or insert this transaction into a Batch."
            title="End delegation"
          />

          <ModalBody>
            <FormControl>
              <OwnedAccountsAutocomplete
                allowUnknown={false}
                inputName="sender"
                isDisabled
                label="From"
              />
            </FormControl>
            <FormLabel marginTop="24px">Baker</FormLabel>
            {baker && <AddressTile address={parsePkh(baker)} />}
          </ModalBody>
          <ModalFooter>
            <FormSubmitButtons
              isLoading={isLoading}
              isValid
              onAddToBatch={handleSubmit(onBatchSubmit)}
              onSingleSubmit={handleSubmit(onSingleSubmit)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

const toOperation = (formValues: FormValues): Undelegation => ({
  type: "undelegation",
  sender: parsePkh(formValues.sender),
});
