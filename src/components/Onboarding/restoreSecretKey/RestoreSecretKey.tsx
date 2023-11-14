import { Button, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";
import { useForm } from "react-hook-form";
import KeyIcon from "../../../assets/icons/Key";
import colors from "../../../style/colors";

export const RestoreSecretKey = ({ goToStep }: { goToStep: (step: Step) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ secretKey: string }>({
    mode: "onBlur",
  });

  const onSubmit = ({ secretKey }: { secretKey: string }) =>
    goToStep({
      type: StepType.nameAccount,
      account: { type: "secret_key", secretKey: secretKey.trim() },
    });
  return (
    <ModalContentWrapper
      icon={<KeyIcon stroke={colors.gray[450]} w="24px" h="24px" />}
      title="Insert Secret Key"
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <FormControl isInvalid={!!errors.secretKey}>
          <FormLabel>Secret Key</FormLabel>
          <Textarea
            minHeight="130px"
            data-testid="name"
            {...register("secretKey", {
              required: "Secret key is required",
            })}
            placeholder="Your secret key"
          />
          {errors.secretKey && <FormErrorMessage>{errors.secretKey.message}</FormErrorMessage>}
        </FormControl>

        <Button isDisabled={!!errors.secretKey} mt="32px" w="100%" size="lg" type="submit">
          Continue
        </Button>
      </form>
    </ModalContentWrapper>
  );
};
