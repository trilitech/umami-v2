import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { SupportedIcons } from "../../../CircleIcon";
import ModalContentWrapper from "../../ModalContentWrapper";

const MIN_LENGTH = 4;

export const EnterAndComfirmPassword: React.FC<{
  onSubmit: (password: string) => void;
  isLoading: boolean;
}> = ({ onSubmit: onSubmitPassword, isLoading }) => {
  type ConfirmPasswordFormValues = {
    password: string;
    confirm: string;
  };

  const { register, handleSubmit, formState, watch } =
    useForm<ConfirmPasswordFormValues>();

  const { errors, isValid, isDirty } = formState;

  const onSubmit = async (data: ConfirmPasswordFormValues) => {
    onSubmitPassword(data.confirm);
  };

  return (
    <ModalContentWrapper
      icon={SupportedIcons.diamont}
      title="Umami Master Password"
      subtitle="Please choose a master password for Umami. You will need to use this password in order to perform any operations within Umami."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center>
          <VStack width={300}>
            <FormControl isInvalid={!isValid && isDirty}>
              <FormLabel>Set Password</FormLabel>
              <Input
                isDisabled={isLoading}
                type="password"
                {...register("password", {
                  required: true,
                })}
                placeholder="Enter account name..."
              />
            </FormControl>

            <FormControl isInvalid={!!errors.confirm && isDirty}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                isDisabled={isLoading}
                type="password"
                {...register("confirm", {
                  required: true,
                  minLength: MIN_LENGTH,
                  validate: (val: string) => {
                    if (watch("password") !== val) {
                      return "Your passwords do no match";
                    }
                  },
                })}
                placeholder="Confirm your new password..."
              />
              {errors.confirm && (
                <FormErrorMessage>{errors.confirm.message}</FormErrorMessage>
              )}
            </FormControl>
            <Button
              isDisabled={!isValid || isLoading}
              isLoading={isLoading}
              type="submit"
              title="Submit"
              w="100%"
              size="lg"
              h="48px"
              bg="umami.blue"
            >
              Submit
            </Button>
          </VStack>
        </Center>
      </form>
    </ModalContentWrapper>
  );
};
