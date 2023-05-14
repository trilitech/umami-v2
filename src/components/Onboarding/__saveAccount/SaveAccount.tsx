import { VStack, Input, Box, Button, FormLabel, FormControl, FormErrorMessage, FormHelperText, useToast } from "@chakra-ui/react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { FieldValues, useForm } from "react-hook-form";
import { useCheckPasswordValidity, useRestore } from "../../../utils/hooks/accountHooks";
import { Step } from "../useOnboardingModal";

const MIN_LENGTH = 4;

const SaveAccount = ({
  setStep,
  seedphrase,
  onClose

}: {
  setStep: (step: Step) => void;
  onClose: () => void;
  seedphrase: string;
}) => {
  const { register, handleSubmit, formState: { errors, isValid, isDirty }, watch } = useForm();
  const restore = useRestore();
  const checkPassword = useCheckPasswordValidity();
  const toast = useToast();


  const onSubmit = async (data: FieldValues) => {
    // setIsloading(true);
    try {
      // if (passwordHasBeenSet) {
      // await checkPassword(password);
      // }
      await restore(seedphrase, data.password, data.account);
      toast({ title: "success" });
      onClose();
    } catch (error: any) {
      // How do we type error?
      toast({ title: "error", description: error.message });
    }
    // setIsloading(false);
  };
  return (
    <ModalContentWrapper
      icon={SupportedIcons.wallet}
      title="Name & Password"
      subtitle="Name your first account and choose a password."
    >
      <Box overflow='scroll' w='100%'>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <VStack w='100%' spacing={4}>
            <FormControl>
              <FormLabel>Account name</FormLabel>
              <Input
                {...register("account", {
                  required: false,
                })}
                placeholder="Optional" />
            </FormControl>
            <FormControl isInvalid={!isValid && isDirty}>
              <FormLabel>Set Password</FormLabel>
              <Input
                type="password"
                {...register("password", {
                  required: true,
                })}
                placeholder="Your password"
              />
            </FormControl>
            <FormControl isInvalid={!!errors.confirm && isDirty}>
              <FormLabel>Confirm password</FormLabel>
              <Input
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
                placeholder="Confirm your new password"
              />
              {errors.confirm ? (
                <FormErrorMessage>{`${errors.confirm.message}`}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  Enter and confirm your new master password
                </FormHelperText>
              )}
            </FormControl>

            <Button
              type="submit"
              bg='umami.blue'
              w='100%'
              size='lg'
              minH='48px'
            >
              Confirm
            </Button>
          </VStack>
        </form>
      </Box>

    </ModalContentWrapper>
  );
};

export default SaveAccount;
