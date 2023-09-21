import {
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { parsePkh, RawPkh, parseImplicitPkh } from "../../../types/Address";
import { BakersAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { formDefaultValues, FormPageProps, FormSubmitButtons } from "../utils";
import SignPage from "./SignPage";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { Delegation } from "../../../types/Operation";
import { FormErrorMessage } from "../../FormErrorMessage";
import { HeaderWrapper } from "../FormPageHeader";
import { useGetDelegateOf } from "../../../utils/hooks/assetsHooks";
import { DynamicModalContext } from "../../DynamicModal";

export type FormValues = {
  sender: RawPkh;
  baker: RawPkh;
};

const toOperation = (formValues: FormValues): Delegation => ({
  type: "delegation",
  sender: parsePkh(formValues.sender),
  recipient: parseImplicitPkh(formValues.baker),
});

const FormPage: React.FC<FormPageProps<FormValues>> = props => {
  const getDelegateOf = useGetDelegateOf();
  const baker = props.sender ? getDelegateOf(props.sender) : undefined;
  const { onClose } = useContext(DynamicModalContext);

  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: undefined,
    FormPage,
    defaultFormPageProps: props,
    toOperation,
  });

  const addToBatch = useAddToBatchFormAction(toOperation, onClose);

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
            <Text size="2xl" fontWeight="600">
              {baker ? "Change Baker" : "Delegate"}
            </Text>
            <ModalCloseButton />
          </HeaderWrapper>

          <ModalBody>
            {/* TODO: Make AccountAutoComplete display the address and balance*/}
            <FormControl isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                label="From"
                isDisabled={!!props.sender}
                inputName="sender"
                allowUnknown={false}
              />
              {errors.sender && (
                <FormErrorMessage data-testid="from-error">
                  {errors.sender.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl mt="24px" isInvalid={!!errors.baker} data-testid="baker">
              <BakersAutocomplete label="Baker" inputName="baker" allowUnknown />
              {errors.baker && <FormErrorMessage>{errors.baker.message}</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <FormSubmitButtons
              isLoading={isLoading}
              isValid={isValid}
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
