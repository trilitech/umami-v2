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
} from "../../../utils/hooks/getAccountDataHooks";
import { useValidateName } from "../../../utils/hooks/labelsHooks";
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
        goBack={() => openWith(<NameMultisigFormPage name={name} />)}
        sender={getMostFundedImplicitAccount(implicitAccounts)}
      />
    );

  const validateName = useValidateName();

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
                    validate: validateName,
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
