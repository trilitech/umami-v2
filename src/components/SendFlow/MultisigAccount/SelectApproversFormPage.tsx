import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import ordinal from "ordinal";
import { useContext } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { NameMultisigFormPage } from "./NameMultisigFormPage";
import { SignTransactionFormPage } from "./SignTransactionFormPage";
import { TrashIcon } from "../../../assets/icons";
import { contract, makeStorageJSON } from "../../../multisig/multisigContract";
import colors from "../../../style/colors";
import { ImplicitAccount } from "../../../types/Account";
import { RawPkh, isValidImplicitPkh, parsePkh } from "../../../types/Address";
import { OwnedImplicitAccountsAutocomplete } from "../../AddressAutocomplete";
import { DynamicModalContext } from "../../DynamicModal";
import { FormErrorMessage } from "../../FormErrorMessage";
import { ModalBackButton } from "../../ModalBackButton";
import { FormPageHeader } from "../FormPageHeader";
import {
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { FormPageProps, formDefaultValues } from "../utils";

export type FormValues = {
  name: string;
  sender: RawPkh; // Fee payer
  signers: { val: RawPkh }[];
  threshold: number;
};

const toOperation = (formValues: FormValues) => ({
  type: "contract_origination" as const,
  sender: parsePkh(formValues.sender),
  code: contract,
  storage: makeStorageJSON(
    formValues.sender,
    formValues.signers.map(s => s.val),
    String(formValues.threshold)
  ),
});

export const SelectApproversFormPage: React.FC<
  FormPageProps<FormValues> & { sender: ImplicitAccount }
> = props => {
  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      sender: props.sender.address.pkh,
      signers: [{ val: "" }],
      threshold: 1,
      ...formDefaultValues(props),
    },
  });

  const {
    formState: { errors, isValid },
    control,
    register,
    handleSubmit,
    getValues,
    watch,
  } = form;
  const signersArray = useFieldArray({
    control,
    name: "signers",
    rules: { minLength: 1 },
  });

  const signersCount = watch("signers").length;

  const openSignPage = useOpenSignPageFormAction({
    SignPage: SignTransactionFormPage,
    signPageExtraData: watch() as FormValues,
    FormPage: SelectApproversFormPage,
    defaultFormPageProps: props,
    toOperation,
  });
  const {
    onFormSubmitActionHandlers: [onSingleSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage]);

  const { openWith } = useContext(DynamicModalContext);
  const goBackToNameStep = () => openWith(<NameMultisigFormPage name={props.form?.name} />);

  return (
    <FormProvider {...form}>
      <ModalContent>
        <ModalBackButton onClick={goBackToNameStep} />

        <form onSubmit={handleSubmit(onSingleSubmit)}>
          <FormPageHeader
            subTitle="Select the participants of the contract and choose the minimum number of approvals."
            title="Select Approvers"
          />

          <ModalBody>
            <Input type="hidden" {...register("sender")} />
            {signersArray.fields.map((field, index) => {
              const error = errors.signers && errors.signers[index];
              const label = `${index === 0 ? "Select " : ""}${ordinal(index + 1)} approver`;
              const inputSize = signersCount > 1 ? "short" : "default";
              const inputWidth = inputSize === "short" ? "368px" : "100%";
              return (
                <FormControl
                  key={field.id}
                  display="inline-block"
                  width={inputWidth}
                  marginBottom="8px"
                  data-testid={`signer-input-${index}`}
                  isInvalid={!!error}
                >
                  <OwnedImplicitAccountsAutocomplete
                    allowUnknown
                    inputName={`signers.${index}.val` as const}
                    label={label}
                    size={inputSize}
                    style={{ width: inputWidth }}
                    validate={signer => {
                      if (!isValidImplicitPkh(signer)) {
                        return "Signer must be valid TZ address";
                      }
                      const addresses = getValues("signers").map(s => s.val);
                      if (addresses.length > new Set(addresses).size) {
                        return "Duplicate approver";
                      }
                    }}
                  />
                  {signersCount > 1 && (
                    <IconButton
                      position="absolute"
                      height="24px"
                      marginTop="-36px"
                      marginLeft="374px"
                      background={colors.gray[500]}
                      aria-label="Remove"
                      data-testid={`remove-signer-${index}`}
                      icon={<TrashIcon width="12px" height="14px" stroke={colors.gray[300]} />}
                      isRound
                      onClick={() => signersArray.remove(index)}
                      size="xs"
                      variant="tertiary"
                    />
                  )}
                  {error && (
                    <FormErrorMessage data-testid={`signer-${index}-error`}>
                      {error.val?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              );
            })}
            <Button
              paddingLeft={0}
              onClick={() => signersArray.append({ val: "" })}
              variant="specialCTA"
            >
              + Add Approver
            </Button>

            <FormControl marginTop="24px" isInvalid={!!errors.threshold}>
              <FormLabel display="inline">
                Min No. of approvals:
                <InputGroup display="inline" marginLeft="10px">
                  <Input
                    width="60px"
                    color="white"
                    data-testid="threshold-input"
                    step={1}
                    type="number"
                    {...register("threshold", {
                      valueAsNumber: true,
                      required: "No. of approvals is required",
                      max: {
                        value: signersCount,
                        message: `Max no. of approvals is ${signersCount}`,
                      },
                      min: {
                        value: 1,
                        message: "Min no. of approvals is 1",
                      },
                    })}
                  />
                </InputGroup>
              </FormLabel>
              <Text display="inline" data-testid="max-signers">
                out of {signersCount}
              </Text>
              {errors.threshold && (
                <FormErrorMessage data-testid="threshold-error">
                  {errors.threshold.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              width="100%"
              isDisabled={!isValid}
              isLoading={isLoading}
              size="lg"
              type="submit"
            >
              Review
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
