import {
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import { RawPkh, parsePkh } from "../../../types/Address";
import { Stake } from "../../../types/Operation";
import { tezToMutez } from "../../../utils/format";
import { TEZ, TEZ_DECIMALS } from "../../../utils/tezos";
import { FormErrorMessage } from "../../FormErrorMessage";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import {
  FormPageProps,
  FormSubmitButtons,
  formDefaultValues,
  getSmallestUnit,
  makeValidateDecimals,
} from "../utils";

type FormValues = {
  sender: RawPkh;
  prettyAmount: string;
};

export const FormPage: React.FC<FormPageProps<FormValues>> = props => {
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
    register,
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <ModalHeader marginBottom="32px">
            <Center>
              <Heading>Select amount</Heading>
            </Center>
          </ModalHeader>
          <ModalBody>
            <FormControl isInvalid={!!errors.prettyAmount}>
              <FormLabel>Enter Amount</FormLabel>

              <InputGroup>
                <Input
                  isDisabled={isLoading}
                  step={getSmallestUnit(TEZ_DECIMALS)}
                  type="number"
                  {...register("prettyAmount", {
                    required: "Amount is required",
                    validate: makeValidateDecimals(TEZ_DECIMALS),
                  })}
                  placeholder="0.000000"
                />
                <InputRightElement>{TEZ}</InputRightElement>
              </InputGroup>
              {errors.prettyAmount && (
                <FormErrorMessage data-testid="amount-error">
                  {errors.prettyAmount.message}
                </FormErrorMessage>
              )}
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

const toOperation = (formValues: FormValues): Stake => ({
  type: "stake",
  amount: tezToMutez(formValues.prettyAmount).toFixed(),
  sender: parsePkh(formValues.sender),
});
