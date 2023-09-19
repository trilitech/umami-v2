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
import { OwnedImplicitAccountsAutocomplete } from "../../../components/AddressAutocomplete";
import SignPage from "./SignPage";
import { contract, makeStorageJSON } from "../../../multisig/multisigContract";
import colors from "../../../style/colors";
import { isValidImplicitPkh, parsePkh, RawPkh } from "../../../types/Address";
import {
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../../../components/SendFlow/onSubmitFormActionHooks";
import { formDefaultValues, FormPageProps } from "../utils";
import { FormErrorMessage } from "../../FormErrorMessage";
import Trash from "../../../assets/icons/Trash";
import FormPageHeader from "../FormPageHeader";

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

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSingleSubmit)}>
          <FormPageHeader
            title="Create Multisig"
            subTitle="Name your contract, select an owner and the signers of the contract."
          />

          <ModalBody>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name the Contract</FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  variant="filled"
                  {...register("name", { required: "Name is required" })}
                  placeholder="The name is only stored locally"
                />
              </InputGroup>
              {errors.name && (
                <FormErrorMessage data-testid="name-error">{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl my="24px" isInvalid={!!errors.sender}>
              <OwnedImplicitAccountsAutocomplete
                label="Select Owner"
                inputName="sender"
                allowUnknown={false}
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
              const inputWidth = signersCount > 1 ? "368px" : "100%";
              return (
                <FormControl
                  data-testid={`signer-input-${index}`}
                  mb="8px"
                  key={field.id}
                  width={inputWidth}
                  display="inline-block"
                  isInvalid={!!error}
                >
                  <OwnedImplicitAccountsAutocomplete
                    style={{ width: inputWidth }}
                    label={label}
                    inputName={`signers.${index}.val` as const}
                    validate={signer => {
                      if (!isValidImplicitPkh(signer)) {
                        return "Signer must be valid TZ address";
                      }
                      const addresses = getValues("signers").map(s => s.val);
                      if (addresses.length > new Set(addresses).size) {
                        return "Duplicate signer";
                      }
                    }}
                    allowUnknown
                  />
                  {signersCount > 1 && (
                    <IconButton
                      size="xs"
                      variant="tertiary"
                      aria-label="Remove"
                      position="absolute"
                      bg={colors.gray[500]}
                      data-testid={`remove-signer-${index}`}
                      icon={<Trash h="14px" w="12px" />}
                      onClick={() => signersArray.remove(index)}
                      height="24px"
                      ml="374px"
                      mt="-36px"
                      isRound
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
              bg="transparent"
              color={colors.greenL}
              onClick={() => signersArray.append({ val: "" })}
            >
              + Add Signer
            </Button>

            <FormControl mt="24px" isInvalid={!!errors.threshold}>
              <FormLabel display="inline">
                Min No. of approvals:
                <InputGroup display="inline" ml="10px">
                  <Input
                    w="60px"
                    type="number"
                    color="white"
                    step={1}
                    variant="filled"
                    data-testid="threshold-input"
                    {...register("threshold", {
                      required: "No. of approvals is required",
                      max: {
                        value: signersCount,
                        message: `Max no. of approvals is ${signersCount}`,
                      },
                      min: {
                        value: 1,
                        message: `Min no. of approvals is 1`,
                      },
                    })}
                  />
                </InputGroup>
                <Text display="inline" ml="10px" data-testid="max-signers">
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
              isDisabled={!isValid}
              isLoading={isLoading}
              size="lg"
              type="submit"
              width="100%"
            >
              Review
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
