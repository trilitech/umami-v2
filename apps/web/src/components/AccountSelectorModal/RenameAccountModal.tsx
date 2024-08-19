import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  VStack,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type Account } from "@umami/core";
import { renameAccount, useAppDispatch, useValidateName } from "@umami/state";
import { useForm } from "react-hook-form";

import { EditIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";

type RenameAccountPageProps = {
  account: Account;
};

export const RenameAccountPage = ({ account }: RenameAccountPageProps) => {
  const dispatch = useAppDispatch();
  const color = useColor();
  const { goBack } = useDynamicModalContext();

  const onSubmitNewName = ({ name }: { name: string }) => {
    dispatch(renameAccount(account, name));
    goBack();
  };

  const {
    handleSubmit,
    formState: { isValid, errors },
    register,
    reset,
  } = useForm<{ name: string }>({
    mode: "onBlur",
    defaultValues: { name: account.label },
  });
  const onSubmit = ({ name }: { name: string }) => {
    onSubmitNewName({ name: name.trim() });
    reset();
  };

  const validateName = useValidateName(account.label);

  return (
    <ModalContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <ModalBackButton />
          <VStack gap="18px">
            <EditIcon width="22px" color={color("blue")} />
            <Heading size="xl">Edit name</Heading>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!errors.name} marginY="30px">
            <FormLabel size="lg">Account name</FormLabel>
            <Input
              type="text"
              {...register("name", {
                required: "Name is required",
                validate: validateName,
              })}
              placeholder="Enter contact's name"
            />
            {errors.name && (
              <FormErrorMessage data-testid="name-error">{errors.name.message}</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button width="full" isDisabled={!isValid} type="submit" variant="primary">
            Update
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
