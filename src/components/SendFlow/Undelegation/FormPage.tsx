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
import { BakerSmallTile } from "../../../views/delegations/BakerSmallTile";

export type FormValues = {
  sender: RawPkh;
};

const toOperation = (formValues: FormValues): Undelegation => ({
  type: "undelegation",
  sender: parsePkh(formValues.sender),
});

const FormPage: React.FC<FormPagePropsWithSender<FormValues>> = ({ sender }) => {
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
      <ModalContent p="40px" pt="8px">
        <form>
          <FormPageHeader
            title="End delegation"
            subTitle="Select preview to end delegation or insert this transaction into a Batch."
          />

          <ModalBody mb="16px">
            {/* TODO: Make AccountAutoComplete display the address and balance*/}
            <FormControl mb="8px">
              <OwnedAccountsAutocomplete
                label="From"
                inputName="sender"
                allowUnknown={false}
                isDisabled
              />
            </FormControl>

            <FormLabel>Baker</FormLabel>
            <BakerSmallTile mode={{ type: "delegatorAccount", account: sender }} />
          </ModalBody>
          <ModalFooter>
            <FormSubmitButtons
              isLoading={isLoading}
              isValid
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
