import { FormControl, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { parsePkh, RawPkh } from "../../../types/Address";
import { OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { formDefaultValues, FormPagePropsWithSender, FormSubmitButtons } from "../utils";
import SignPage from "./SignPage";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { Undelegation } from "../../../types/Operation";
import FormPageHeader from "../FormPageHeader";
import { BakerSmallTile } from "../BakerSmallTile";

export type FormValues = {
  sender: RawPkh;
  baker: RawPkh;
};

const toOperation = (formValues: FormValues): Undelegation => ({
  type: "undelegation",
  sender: parsePkh(formValues.sender),
});

const FormPage: React.FC<FormPagePropsWithSender<FormValues>> = props => {
  const { sender } = props;
  // it must always be passed in from the parent component
  const baker = props.form?.baker as string;

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
            <BakerSmallTile pkh={baker} />
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
export default FormPage;
