import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { FormPage } from "./FormPage";
import {
  useGetNextAvailableAccountLabels,
  useIsUniqueLabel,
} from "../../../utils/hooks/getAccountDataHooks";
import { DynamicModalContext } from "../../DynamicModal";
import { FormErrorMessage } from "../../FormErrorMessage";
import { FormPageHeader } from "../FormPageHeader";

const DEFAULT_MULTISIG_LABEL = "Multisig Account";

type FormValues = {
  name: string;
};

export const NameMultisigFormPage: React.FC<{
  name?: string;
}> = ({ name }) => {
  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: name ? { name } : { name: "" },
  });
  const {
    formState: { errors, isValid },
    register,
    handleSubmit,
  } = form;

  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  const { openWith } = useContext(DynamicModalContext);
  const openSelectApproversFormPage = (props: FormValues) => {
    const label = props.name.trim() || getNextAvailableAccountLabels(DEFAULT_MULTISIG_LABEL)[0];

    return openWith(
      <FormPage
        form={{
          name: label,
          sender: "",
          signers: [],
          threshold: 1,
        }}
      />
    );
  };

  const isUnique = useIsUniqueLabel();
  return (
    <FormProvider {...form}>
      <ModalContent>
        <form onSubmit={handleSubmit(openSelectApproversFormPage)}>
          <FormPageHeader
            subTitle="Name your account. The account name will only appear in your local Umami app."
            title="Account Name"
          />

          <ModalBody>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Account Name</FormLabel>
              <InputGroup>
                <Input
                  data-testid="multisig-account-name"
                  type="text"
                  {...register("name", {
                    required: false,
                    validate: name => {
                      if (!isUnique(name)) {
                        return "Name must be unique across all accounts and contacts";
                      }
                    },
                  })}
                  placeholder="Optional"
                />
              </InputGroup>
              {errors.name && (
                <FormErrorMessage data-testid="name-error">{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button width="100%" isDisabled={!isValid} size="lg" type="submit">
              Continue
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
