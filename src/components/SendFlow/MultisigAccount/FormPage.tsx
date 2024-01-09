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
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import { TrashIcon } from "../../../assets/icons";
import { OwnedImplicitAccountsAutocomplete } from "../../../components/AddressAutocomplete";
import {
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../../../components/SendFlow/onSubmitFormActionHooks";
import { contract, makeStorageJSON } from "../../../multisig/multisigContract";
import colors from "../../../style/colors";
import { RawPkh, isValidImplicitPkh, parsePkh } from "../../../types/Address";
import { useIsUniqueLabel } from "../../../utils/hooks/getAccountDataHooks";
import { FormErrorMessage } from "../../FormErrorMessage";
import { FormPageHeader } from "../FormPageHeader";
import { FormPageProps, formDefaultValues } from "../utils";

export type FormValues = {
  name: string;
  sender: RawPkh;
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

export const FormPage: React.FC<FormPageProps<FormValues>> = props => {
  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { signers: [{ val: "" }], threshold: 1, ...formDefaultValues(props) },
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
    SignPage,
    signPageExtraData: watch(),
    FormPage,
    defaultFormPageProps: {},
    toOperation,
  });

  const {
    onFormSubmitActionHandlers: [onSingleSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage]);

  const isUnique = useIsUniqueLabel();

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSingleSubmit)}>
          <FormPageHeader
            subTitle="Name your contract, select an owner and the signers of the contract."
            title="Create Multisig"
          />

          <ModalBody>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name the Contract</FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    validate: name => {
                      if (!isUnique(name)) {
                        return "Name must be unique across all accounts and contacts";
                      }
                    },
                  })}
                  placeholder="The name is only stored locally"
                />
              </InputGroup>
              {errors.name && (
                <FormErrorMessage data-testid="name-error">{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.sender} marginY="24px">
              <OwnedImplicitAccountsAutocomplete
                allowUnknown={false}
                inputName="sender"
                label="Select Owner"
              />
              {errors.sender && (
                <FormErrorMessage data-testid="owner-error">
                  {errors.sender.message}
                </FormErrorMessage>
              )}
            </FormControl>
            {signersArray.fields.map((field, index) => {
              const error = errors.signers && errors.signers[index];
              const label = `${index === 0 ? "Select " : ""}${index + 1} signer`;
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
                        return "Duplicate signer";
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
              + Add Signer
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
                <Text display="inline" marginLeft="10px" data-testid="max-signers">
                  out of {signersCount}
                </Text>
              </FormLabel>
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
