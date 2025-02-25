import { FormControl, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import hj from "@hotjar/browser";
import { type Undelegation } from "@umami/core";
import { type RawPkh, parsePkh } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import { OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { AddressTile } from "../../AddressTile/AddressTile";
import { FormPageHeader } from "../FormPageHeader";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { type FormPagePropsWithSender, FormSubmitButton, formDefaultValues } from "../utils";

export type FormValues = {
  sender: RawPkh;
  baker: RawPkh;
};

export const FormPage = (props: FormPagePropsWithSender<FormValues>) => {
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
    onFormSubmitActionHandlers: [onSingleSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: formDefaultValues({ sender }),
  });

  const { handleSubmit } = form;

  hj.stateChange("send_flow/undelegation_form_page");

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form data-testid="undelegate-form" onSubmit={handleSubmit(onSingleSubmit)}>
          <FormPageHeader
            subTitle="Select preview to end delegation or insert this transaction into a batch."
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
            <FormSubmitButton isLoading={isLoading} />
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
