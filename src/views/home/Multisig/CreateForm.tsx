import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { BsTrash } from "react-icons/bs";
import { OwnedImplicitAccountsAutocomplete } from "../../../components/AddressAutocomplete";
import colors from "../../../style/colors";
import { Step, InitialStep, MultisigFields } from "./useCreateMultisigModal";

export const CreateForm: React.FC<{ goToStep: (step: Step) => void; currentStep: InitialStep }> = ({
  goToStep,
  currentStep,
}) => {
  const { defaultOwner, data } = currentStep;
  const form = useForm<MultisigFields>({
    mode: "onBlur",
    defaultValues: data || {
      owner: defaultOwner.address.pkh,
      signers: [{ val: defaultOwner.address.pkh }],
      threshold: 1,
    },
  });

  const {
    formState: { errors, isValid },
    control,
    register,
    handleSubmit,
    watch,
  } = form;
  const signersArray = useFieldArray({
    control,
    name: "signers",
    rules: { minLength: 1 }, // TODO: add uniqueness validation and the address type check
  });

  const onSubmit = (multisigFields: MultisigFields) => {
    // saves the form for history to work
    currentStep.data = multisigFields;
    goToStep({ type: "review", data: multisigFields });
  };

  const signersWatch = watch("signers");
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader textAlign="center">Create Multisig</ModalHeader>

        <ModalBody>
          <Text fontSize="sm" color="umami.gray.400" textAlign="center">
            Name your contract, select an owner and the signers of the contract.
          </Text>

          <FormControl mb={2} isInvalid={!!errors.name}>
            <FormLabel>Name the Contract</FormLabel>
            <InputGroup>
              <Input
                type="text"
                step={1}
                {...register("name", { required: "Name is required" })}
                placeholder="The name is only stored locally"
              />
            </InputGroup>
            {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
          </FormControl>

          <FormControl mb={2} isInvalid={!!errors.owner}>
            <OwnedImplicitAccountsAutocomplete
              label="Select Owner"
              inputName="owner"
              allowUnknown={false}
            />
            {errors.owner && <FormErrorMessage>{errors.owner.message}</FormErrorMessage>}
          </FormControl>
          {signersArray.fields.map((field, index) => {
            const error = errors.signers && errors.signers[index];
            const label = `${index === 0 ? "Select " : ""}${index + 1} signer`;

            return (
              <FormControl
                mb={2}
                key={field.id}
                isInvalid={!!error}
                width={signersWatch.length > 1 ? "355px" : "400px"}
              >
                <OwnedImplicitAccountsAutocomplete
                  label={label}
                  inputName={`signers.${index}.val` as const}
                  allowUnknown
                />
                {signersWatch.length > 1 && (
                  <IconButton
                    size="md"
                    variant="ghost"
                    aria-label="Remove"
                    position="absolute"
                    float="right"
                    mt="-40px"
                    ml="360px"
                    color="umami.gray.450"
                    icon={<BsTrash />}
                    onClick={() => signersArray.remove(index)}
                  />
                )}
                {error && <FormErrorMessage>{error.val?.message}</FormErrorMessage>}
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
                  {...register("threshold", {
                    required: "No. of approvals is required",
                    max: {
                      value: signersWatch.length,
                      message: `Max no. of approvals is ${signersWatch.length}`,
                    },
                    min: {
                      value: 1,
                      message: `Min no. of approvals is 1`,
                    },
                  })}
                />
              </InputGroup>
              <Text display="inline" ml="10px">
                out of {signersWatch.length}
              </Text>
            </FormLabel>
            {errors.threshold && <FormErrorMessage>{errors.threshold.message}</FormErrorMessage>}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={!isValid}
            type="submit"
            width="100%"
            bg={isValid ? "umami.blue" : "umami.gray.700"}
          >
            Review
          </Button>
        </ModalFooter>
      </form>
    </FormProvider>
  );
};
