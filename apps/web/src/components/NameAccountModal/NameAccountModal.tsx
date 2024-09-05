import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext, useMultiForm } from "@umami/components";
import { type ReactElement } from "react";

import { UserIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";

type NameAccountModalProps = {
  nextModal: ReactElement;
  onSubmit?: (values: Record<string, any>) => void;
};

export const NameAccountModal = ({ onSubmit, nextModal }: NameAccountModalProps) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();

  const form = useMultiForm({
    mode: "onBlur",
    defaultValues: {
      accountName: "",
    },
  });

  const { register, handleSubmit } = form;

  const handleProceedToNext = (values: { accountName: string }) => {
    onSubmit?.(values);
    return openWith(nextModal);
  };

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="12px">
          <Icon as={UserIcon} boxSize="24px" marginBottom="4px" color={color("blue")} />
          <Heading size="xl">Name Your Account</Heading>
          <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
            Name the new account derived from mnemonic
          </Text>
        </Center>
      </ModalHeader>
      <form onSubmit={handleSubmit(handleProceedToNext)} style={{ width: "100%" }}>
        <ModalBody>
          <FormControl>
            <FormLabel>Account name</FormLabel>
            <Input
              data-testid="accountName"
              type="text"
              {...register("accountName", {
                required: false,
              })}
              placeholder="Optional"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button width="full" type="submit" variant="primary">
            Continue
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
