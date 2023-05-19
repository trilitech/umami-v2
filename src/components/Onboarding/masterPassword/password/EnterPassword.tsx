import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { isValid } from "date-fns";
import { useForm } from "react-hook-form";
import { SupportedIcons } from "../../../CircleIcon";
import ModalContentWrapper from "../../ModalContentWrapper";

const MIN_LENGTH = 4;

const EnterPassword = ({
  onSubmit: onSubmitPassword,
  isLoading,
}: {
  onSubmit: (s: string) => void;
  isLoading: boolean;
}) => {
  const { register, handleSubmit, formState } = useForm<{
    password: string;
  }>({
    mode: "onBlur",
  });

  const onSubmit = (p: { password: string }) => {
    onSubmitPassword(p.password);
  };

  return (
    <ModalContentWrapper
      icon={SupportedIcons.diamont}
      title="Umami Master Password"
      subtitle="Enter your master password for Umami."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center>
          <VStack width={300}>
            <Heading>Enter Password to continue</Heading>
            <FormControl isInvalid={!isValid && formState.isDirty}>
              <FormLabel>Password</FormLabel>
              <Input
                data-testid="password"
                isDisabled={isLoading}
                type="password"
                {...register("password", {
                  required: true,
                  minLength: MIN_LENGTH,
                })}
                placeholder="Enter your new password..."
              />
            </FormControl>

            <Button
              isDisabled={!isValid || isLoading}
              isLoading={isLoading}
              type="submit"
              colorScheme="gray"
              title="Submit"
            >
              Submit
            </Button>
          </VStack>
        </Center>
      </form>
    </ModalContentWrapper>
  );
};

export default EnterPassword;
