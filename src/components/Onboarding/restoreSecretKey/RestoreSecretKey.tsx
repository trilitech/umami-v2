import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { InMemorySigner } from "@taquito/signer";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { KeyIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { isEncryptedSecretKeyPrefix } from "../../../utils/redux/thunks/secretKeyAccount";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

export const RestoreSecretKey = ({ goToStep }: { goToStep: (step: Step) => void }) => {
  const [isEncrypted, setIsEncrypted] = useState(false);
  const { handleAsyncAction } = useAsyncActionHandler();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ secretKey: string; password: string }>({
    mode: "onBlur",
    defaultValues: { password: "" },
  });

  const onSubmit = async ({
    secretKey: rawSecretKey,
    password,
  }: {
    secretKey: string;
    password: string;
  }) =>
    handleAsyncAction(async () => {
      try {
        // validate secret key
        const signer = await InMemorySigner.fromSecretKey(rawSecretKey.trim(), password);
        const unencryptedSecretKey = await signer.secretKey();

        goToStep({
          type: StepType.nameAccount,
          account: { type: "secret_key", secretKey: unencryptedSecretKey },
        });
      } catch (error: any) {
        const message = error.message || "";

        // if the password doesn't match taquito throws this error
        if (message.includes("Cannot read properties of null (reading 'slice')")) {
          throw new Error("Key-password pair is invalid");
        }

        if (message.includes("Invalid checksum")) {
          throw new Error("Invalid secret key: checksum doesn't match");
        }

        throw error;
      }
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
            data-testid="secret-key"
            {...register("secretKey", {
              required: "Secret key is required",
              // taken from https://github.com/ecadlabs/taquito/blob/master/packages/taquito-signer/src/taquito-signer.ts#L95
              onChange: event =>
                setIsEncrypted(isEncryptedSecretKeyPrefix(event.target.value.trim())),
            })}
            placeholder="Your secret key"
          />
          {errors.secretKey && <FormErrorMessage>{errors.secretKey.message}</FormErrorMessage>}
        </FormControl>

        {isEncrypted && (
          <FormControl marginTop="20px" isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              data-testid="password"
              {...register("password", {
                validate: value => {
                  if (!value.trim()) {
                    return "Password is required";
                  }
                },
              })}
            />
            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          </FormControl>
        )}

        <Button width="100%" marginTop="32px" isDisabled={!isValid} size="lg" type="submit">
          Continue
        </Button>
      </form>
    </ModalContentWrapper>
  );
};
