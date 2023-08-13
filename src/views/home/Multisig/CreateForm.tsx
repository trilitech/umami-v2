import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { BsTrash } from "react-icons/bs";
import { OwnedImplicitAccountsAutocomplete } from "../../../components/AddressAutocomplete";
import { DynamicModalContext } from "../../../components/DynamicModal";
import SignPage from "../../../components/SendFlow/SignPage";
import { makeFormOperations } from "../../../components/sendForm/types";
import { contract, makeStorageJSON } from "../../../multisig/multisigContract";
import colors from "../../../style/colors";
import { isValidImplicitPkh, parsePkh, RawPkh } from "../../../types/Address";
import { ContractOrigination } from "../../../types/Operation";
import { useGetBestSignerForAccount, useGetOwnedAccount } from "../../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../../utils/hooks/assetsHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { estimateTotalFee } from "../../batch/batchUtils";

export type MultisigFields = {
  name: string;
  owner: RawPkh;
  signers: { val: RawPkh }[];
  threshold: number;
};

export const CreateForm: React.FC<{
  formValues?: MultisigFields;
}> = ({ formValues: defaultValues }) => {
  const { openWith } = useContext(DynamicModalContext);
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const getAccount = useGetOwnedAccount();
  const getSigner = useGetBestSignerForAccount();
  const network = useSelectedNetwork();
  const form = useForm<MultisigFields>({
    mode: "onBlur",
    defaultValues: defaultValues || { signers: [{ val: "" }] },
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

  const signers = watch("signers");

  const onSubmit = async (formValues: MultisigFields) =>
    handleAsyncAction(async () => {
      const operation: ContractOrigination = {
        type: "contract_origination",
        sender: parsePkh(formValues.owner),
        code: contract,
        storage: makeStorageJSON(
          formValues.owner,
          formValues.signers.map(s => s.val),
          String(formValues.threshold)
        ),
      };
      const sender = getAccount(formValues.owner);
      const operations = makeFormOperations(sender, getSigner(sender), [operation]);
      const fee = await estimateTotalFee(operations, network);

      openWith(
        <SignPage
          mode="single"
          operations={operations}
          fee={fee}
          goBack={() => openWith(<CreateForm formValues={formValues} />)}
        />
      );
    });

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader textAlign="center">
            <Text size="2xl" fontWeight="600">
              Create Multisig
            </Text>
            <Text textAlign="center" size="sm" color={colors.gray[400]}>
              Name your contract, select an owner and the signers of the contract.
            </Text>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <FormControl mb={2} isInvalid={!!errors.name}>
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

            <FormControl mb={2} isInvalid={!!errors.owner}>
              <OwnedImplicitAccountsAutocomplete
                label="Select Owner"
                inputName="owner"
                allowUnknown={false}
              />
              {errors.owner && (
                <FormErrorMessage data-testid="owner-error">
                  {errors.owner.message}
                </FormErrorMessage>
              )}
            </FormControl>
            {signersArray.fields.map((field, index) => {
              const error = errors.signers && errors.signers[index];
              const label = `${index === 0 ? "Select " : ""}${index + 1} signer`;
              // TODO: make modal padding match figma and set the max width to 400px
              const inputWidth = signers.length > 1 ? "390px" : "434px";
              return (
                <FormControl
                  data-testid={`signer-input-${index}`}
                  mb={2}
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
                  {signers.length > 1 && (
                    <IconButton
                      size="md"
                      variant="ghost"
                      aria-label="Remove"
                      color="umami.gray.450"
                      position="absolute"
                      data-testid={`remove-signer-${index}`}
                      icon={<BsTrash />}
                      onClick={() => signersArray.remove(index)}
                      height="40px"
                      ml="396px"
                      mt="-44px"
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

            <FormControl mb={2} isInvalid={!!errors.threshold}>
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
                        value: signers.length,
                        message: `Max no. of approvals is ${signers.length}`,
                      },
                      min: {
                        value: 1,
                        message: `Min no. of approvals is 1`,
                      },
                    })}
                  />
                </InputGroup>
                <Text display="inline" ml="10px" data-testid="max-signers">
                  out of {signers.length}
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
              type="submit"
              width="100%"
              variant="primary"
            >
              Review
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
