import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Heading,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { noop } from "lodash";
import { FormProvider, useForm } from "react-hook-form";

import { WarningIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { WalletClient } from "../../utils/beacon/WalletClient";
import { persistor } from "../../utils/redux/persistor";
import { FormErrorMessage } from "../FormErrorMessage";

const CONFIRMATION_CODE = "wasabi";

const reset = () =>
  WalletClient.destroy()
    .catch(noop)
    .finally(() => {
      persistor.pause();
      localStorage.clear();
      window.location.reload();
    });

export const OffboardingForm = () => {
  const form = useForm<{ check: boolean; confirmationCode: string }>({
    mode: "onBlur",
  });
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    getValues,
  } = form;

  const onSubmit = () => {
    if (!getValues("check") || getValues("confirmationCode") !== CONFIRMATION_CODE) {
      return;
    }
    return reset();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton />

        <ModalHeader marginBottom="10px" textAlign="center">
          <Box>
            <WarningIcon width="40px" height="40px" marginBottom="20px" />
            <Heading>Off-board Wallet</Heading>
          </Box>
        </ModalHeader>
        <Box>
          <Text
            marginBottom="8px"
            color={colors.gray[400]}
            fontWeight="bold"
            textAlign="center"
            size="sm"
          >
            This will permanently remove any data from this computer.
          </Text>
          <Text color={colors.gray[400]} textAlign="center" size="sm">
            Please enter « {CONFIRMATION_CODE} » to confirm. The accounts are still available to be
            imported in the future; in order to regain access to your accounts, please make sure
            that you keep the recovery phrase.
          </Text>
          <ModalBody>
            <Divider borderColor={colors.gray[700]} marginY="20px" />
            <FormControl isInvalid={!!errors.check}>
              <Checkbox {...register("check", { required: true })}>
                <Text marginLeft="8px" fontWeight="bold">
                  I have read the warning and I am certain I want to remove my private keys locally.
                  I also made sure to keep my recovery phrase.
                </Text>
              </Checkbox>
            </FormControl>
            <Divider borderColor={colors.gray[700]} marginY="20px" />
            <FormControl isInvalid={!!errors.confirmationCode} paddingY={5}>
              <Input
                type="text"
                {...register("confirmationCode", {
                  required: "Confirmation is required",
                  validate: (confirmationCode: string) =>
                    confirmationCode === CONFIRMATION_CODE || "Confirmation code does not match",
                })}
                placeholder="Enter code word to confirm"
              />
              {errors.confirmationCode && (
                <FormErrorMessage>{errors.confirmationCode.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
        </Box>

        <ModalFooter padding={0}>
          <Button
            width="100%"
            marginBottom="8px"
            isDisabled={!isValid}
            size="lg"
            type="submit"
            variant="warning"
          >
            Confirm
          </Button>
        </ModalFooter>
      </form>
    </FormProvider>
  );
};
