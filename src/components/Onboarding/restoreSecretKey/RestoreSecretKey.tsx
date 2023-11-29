import { Button, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { KeyIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

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
      icon={<KeyIcon width="24px" height="24px" stroke={colors.gray[450]} />}
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

        <Button
          width="100%"
          marginTop="32px"
          isDisabled={!!errors.secretKey}
          size="lg"
          type="submit"
        >
          Continue
        </Button>
      </form>
    </ModalContentWrapper>
  );
};
