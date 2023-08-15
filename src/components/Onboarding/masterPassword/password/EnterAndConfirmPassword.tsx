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

export const MIN_LENGTH = 8;

export const EnterAndConfirmPassword: React.FC<{
  onSubmit: (password: string) => void;
  isLoading: boolean;
}> = ({ onSubmit: onSubmitPassword, isLoading }) => {
  type ConfirmPasswordFormValues = {
    password: string;
    confirm: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ConfirmPasswordFormValues>({
    mode: "onBlur",
  });

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
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Set Password</FormLabel>
              <Input
                type="password"
                autoComplete="off"
                data-testid="password"
                {...register("password", {
                  required: true,
                  minLength: {
                    value: MIN_LENGTH,
                    message: `Your password must be at least ${MIN_LENGTH} characters long`,
                  },
                })}
                placeholder="Enter master password..."
              />
              {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.confirm}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                autoComplete="off"
                data-testid="confirmation"
                {...register("confirm", {
                  required: true,
                  validate: (val: string) => {
                    return getValues("password") === val || "Your passwords do no match";
                  },
                })}
                placeholder="Confirm your password..."
              />
              {errors.confirm && <FormErrorMessage>{errors.confirm.message}</FormErrorMessage>}
            </FormControl>
            <Button
              mt={5}
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

export default EnterAndConfirmPassword;
