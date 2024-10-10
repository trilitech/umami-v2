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
import { defaultDerivationPathTemplate } from "@umami/tezos";
import { FormProvider } from "react-hook-form";

import { UserIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";
import { AdvancedAccountSettings } from "../Onboarding/AdvancedAccountSettings";

type NameAccountModalProps = {
  title?: string;
  subtitle?: string;
  onSubmit: (values: { accountName: string }) => void;
  withAdvancedSettings?: boolean;
  buttonLabel?: string;
};

export const NameAccountModal = ({
  title = "Name Your Account",
  subtitle,
  onSubmit,
  withAdvancedSettings = false,
  buttonLabel = "Continue",
}: NameAccountModalProps) => {
  const color = useColor();

  const form = useMultiForm({
    mode: "onBlur",
    defaultValues: {
      accountName: "",
      ...(withAdvancedSettings && {
        derivationPath: defaultDerivationPathTemplate,
        curve: "ed25519",
      }),
    },
  });

  const { register, handleSubmit } = form;

  return (
    <ModalContent data-testid="name-account-modal">
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="12px">
          <Icon as={UserIcon} boxSize="24px" marginBottom="4px" color={color("400")} />
          <Heading size="xl">{title}</Heading>
          {subtitle && (
            <Text
              width="full"
              maxWidth="340px"
              color={color("700")}
              fontWeight="400"
              textAlign="center"
              whiteSpace="pre-wrap"
              size="md"
            >
              {subtitle}
            </Text>
          )}
        </Center>
      </ModalHeader>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <ModalBody gap="30px">
            <FormControl>
              <FormLabel>Account name (Optional)</FormLabel>
              <Input
                data-testid="accountName"
                type="text"
                {...register("accountName", {
                  required: false,
                })}
                placeholder="Enter Account Name"
              />
            </FormControl>
            {withAdvancedSettings && <AdvancedAccountSettings />}
          </ModalBody>
          <ModalFooter>
            <Button width="full" type="submit" variant="primary">
              {buttonLabel}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </ModalContent>
  );
};
