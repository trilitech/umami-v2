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
import { useMultiForm } from "@umami/components";

import { UserIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";

type NameAccountModalProps = {
  title?: string;
  subtitle?: string;
  onSubmit: (values: { accountName: string }) => void;
};

export const NameAccountModal = ({
  title = "Name Your Account",
  subtitle,
  onSubmit,
}: NameAccountModalProps) => {
  const color = useColor();

  const form = useMultiForm({
    mode: "onBlur",
    defaultValues: {
      accountName: "",
    },
  });

  const { register, handleSubmit } = form;

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="12px">
          <Icon as={UserIcon} boxSize="24px" marginBottom="4px" color={color("blue")} />
          <Heading size="xl">{title}</Heading>
          {subtitle && (
            <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
              {subtitle}
            </Text>
          )}
        </Center>
      </ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
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
