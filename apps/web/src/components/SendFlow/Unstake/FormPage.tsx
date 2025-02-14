import {
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { type Unstake } from "@umami/core";
import { type RawPkh, TEZ, TEZ_DECIMALS, parsePkh, tezToMutez } from "@umami/tezos";
import { BigNumber } from "bignumber.js";
import { FormProvider, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import { TezTile } from "../../AssetTiles/TezTile";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import {
  type FormPageProps,
  FormSubmitButton,
  formDefaultValues,
  getSmallestUnit,
  makeValidateDecimals,
} from "../utils";

type FormValues = {
  sender: RawPkh;
  prettyAmount: string;
};

// TODO: test
export const FormPage = (props: FormPageProps<FormValues> & { stakedBalance: number }) => {
  const stakedBalance = props.stakedBalance;

  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: { stakedBalance },
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
    register,
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSingleSubmit)}>
          <ModalHeader marginBottom="32px">
            <Center>
              <Heading>Select amount</Heading>
            </Center>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <FormLabel>Stake amount</FormLabel>
            <TezTile mutezAmount={stakedBalance} />

            <FormControl marginTop="24px" isInvalid={!!errors.prettyAmount}>
              <FormLabel>Enter amount</FormLabel>
              <InputGroup>
                <Input
                  isDisabled={isLoading}
                  step={getSmallestUnit(TEZ_DECIMALS)}
                  type="number"
                  {...register("prettyAmount", {
                    required: "Amount is required",
                    validate: value => {
                      if (tezToMutez(value).gt(BigNumber(stakedBalance))) {
                        return "Amount must be less than or equal to the staked balance";
                      }
                      return makeValidateDecimals(TEZ_DECIMALS)(value);
                    },
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
            <FormSubmitButton isLoading={isLoading} />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

const toOperation = (formValues: FormValues): Unstake => ({
  type: "unstake",
  amount: tezToMutez(formValues.prettyAmount).toFixed(),
  sender: parsePkh(formValues.sender),
});
