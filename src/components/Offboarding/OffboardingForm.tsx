import {
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  ModalFooter,
  Box,
  Button,
  Input,
  Checkbox,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import WarningIcon from "../../assets/icons/Warning";
import colors from "../../style/colors";
import { useReset } from "../../utils/hooks/setAccountDataHooks";
import { FormErrorMessage } from "../FormErrorMessage";

const CONFIRMATION_CODE = "wasabi";

const OffboardingForm = () => {
  const reset = useReset();

  const onSubmit = () => {
    if (!getValues("check") || getValues("confirmationCode") !== CONFIRMATION_CODE) {
      return;
    }
    reset();
  };

  const form = useForm<{ check: boolean; confirmationCode: string }>({
    mode: "onBlur",
  });
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    getValues,
  } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton />

        <ModalHeader marginBottom="12px" textAlign="center">
          <Box>
            <WarningIcon w={10} h={10} mb={5} />
            <Heading>Off-board Wallet</Heading>
          </Box>
        </ModalHeader>
        <Box>
          <Text
            marginBottom={2}
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
            <Divider borderColor={colors.gray[700]} marginY={5} />
            <FormControl isInvalid={!!errors.check}>
              <Checkbox {...register("check", { required: true })}>
                <Text marginLeft={2} fontWeight="bold">
                  I have read the warning and I am certain I want to remove my private keys locally.
                  I also made sure to keep my recovery phrase.
                </Text>
              </Checkbox>
            </FormControl>
            <Divider borderColor={colors.gray[700]} marginY={5} />
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
            marginBottom={2}
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

export default OffboardingForm;
