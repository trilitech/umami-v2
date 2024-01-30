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

import { SelectApproversFormPage } from "./SelectApproversFormPage";
import {
  useGetMostFundedImplicitAccount,
  useImplicitAccounts,
  useIsUniqueLabel,
} from "../../../utils/hooks/getAccountDataHooks";
import { DynamicModalContext } from "../../DynamicModal";
import { FormErrorMessage } from "../../FormErrorMessage";
import { FormPageHeader } from "../FormPageHeader";

type FormValues = {
  name: string;
};

export const NameMultisigFormPage: React.FC<{ name?: string }> = ({ name }) => {
  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { name: name || "" },
  });
  const {
    formState: { errors, isValid },
    register,
    handleSubmit,
  } = form;

  const implicitAccounts = useImplicitAccounts();
  const getMostFundedImplicitAccount = useGetMostFundedImplicitAccount();

  const { openWith } = useContext(DynamicModalContext);
  const openSelectApproversFormPage = ({ name }: FormValues) =>
    openWith(
      <SelectApproversFormPage
        form={{ name: name.trim() } as any}
        sender={getMostFundedImplicitAccount(implicitAccounts)}
      />
    );

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
                      if (name.trim().length == 0) {
                        return "Name should not be empty";
                      }
                      if (!isUnique(name.trim())) {
                        return "Name must be unique across all accounts and contacts";
                      }
                    },
                  })}
                  placeholder="Account Name"
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
