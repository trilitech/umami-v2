import {
  Button,
  Center,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useMultiForm } from "@umami/components";
import { FormProvider } from "react-hook-form";

import { LockIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";
import { PasswordInput } from "../PasswordInput";

type MasterPasswordModalProps = {
  onSubmit: ({ password }: { password: string }) => void;
};

export const MasterPasswordModal = ({ onSubmit }: MasterPasswordModalProps) => {
  const color = useColor();

  const form = useMultiForm({
    defaultValues: {
      password: "",
    },
  });

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="12px">
          <Icon as={LockIcon} boxSize="24px" marginBottom="4px" color={color("blue")} />
          <Heading size="xl">Confirm password</Heading>
          <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
            Enter your master password
          </Text>
        </Center>
      </ModalHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ModalBody>
            <PasswordInput
              data-testid="master-password"
              inputName="password"
              label="Password"
              placeholder="Enter your password"
              required="Password is required"
            />
          </ModalBody>
          <ModalFooter>
            <Button width="full" type="submit" variant="primary">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </ModalContent>
  );
};
