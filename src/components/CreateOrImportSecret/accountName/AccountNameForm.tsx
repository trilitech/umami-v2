import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const AccountNameForm = ({
  onSubmit: onSubmitPassword,
  isLoading,
}: {
  onSubmit: (s: string) => void;
  isLoading: boolean;
}) => {
  const { register, handleSubmit, formState } = useForm<{
    accountName: string;
  }>({
    mode: "onBlur",
  });

  const onSubmit = (p: { accountName: string }) => {
    onSubmitPassword(p.accountName);
  };
  const isValid = formState.isValid;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center>
        <VStack width={300}>
          <Heading>Enter account name</Heading>
          <FormControl isInvalid={!isValid}>
            <FormLabel>name</FormLabel>
            <Input
              // isDisabled={isLoading}
              type="text"
              {...register("accountName", {
                required: true,
              })}
              placeholder="Enter account name..."
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
  );
};

export default AccountNameForm;
