import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useDynamicModalContext, useMultiForm } from "@umami/components";
import { isEncryptedSecretKeyPrefix, useAsyncActionHandler } from "@umami/state";
import { decryptSecretKey } from "@umami/tezos";
import { useState } from "react";
import { FormProvider } from "react-hook-form";

import { PasswordInput } from "../../PasswordInput";
import { SetupPassword } from "../SetupPassword";

type FormValues = { secretKey: string; secretKeyPassword: string };

export const SecretKeyTab = () => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const form = useMultiForm<FormValues>({
    mode: "onBlur",
    defaultValues: { secretKey: "", secretKeyPassword: "" },
  });
  const [isEncrypted, setIsEncrypted] = useState(
    isEncryptedSecretKeyPrefix(form.watch("secretKey"))
  );
  const { openWith } = useDynamicModalContext();

  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = form;

  const onSubmit = ({ secretKey, secretKeyPassword }: FormValues) =>
    handleAsyncAction(async () => {
      // validate secret key
      await decryptSecretKey(secretKey, secretKeyPassword);
      return openWith(<SetupPassword mode="secret_key" />);
    });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column" gap="24px">
          <FormControl isInvalid={!!form.formState.errors.secretKey}>
            <FormLabel>Secret Key</FormLabel>
            <Textarea
              minHeight="120px"
              fontSize="18px"
              {...register("secretKey", {
                required: "Secret Key is required",
                onChange: event => setIsEncrypted(isEncryptedSecretKeyPrefix(event.target.value)),
              })}
              placeholder="Type here..."
            />
            {errors.secretKey && <FormErrorMessage>{errors.secretKey.message}</FormErrorMessage>}
          </FormControl>

          {isEncrypted && <PasswordInput inputName="secretKeyPassword" minLength={0} />}

          <Button width="full" isDisabled={!isValid} type="submit" variant="primary">
            Next
          </Button>
        </Flex>
      </form>
    </FormProvider>
  );
};
