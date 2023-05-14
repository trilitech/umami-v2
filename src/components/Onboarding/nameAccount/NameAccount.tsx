import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import {
  Step,
  StepType,
  TemporaryAccountConfig,
  TemporaryLedgerAccountConfig,
} from "../useOnboardingModal";

export const NameAccount = ({
  setStep,
  config,
}: {
  setStep: (step: Step) => void;
  config: TemporaryAccountConfig;
}) => {
  const { register, handleSubmit, formState } = useForm<{
    accountName: string;
  }>();
  const onSubmit = (p: { accountName: string }) => {
    config.label = p.accountName;
    if (config instanceof TemporaryLedgerAccountConfig) {
      setStep({ type: StepType.masterPassword, config: config });
    } else {
      setStep({ type: StepType.derivationPath, config: config });
    }
  };
  const isValid = formState.isValid;

  return (
    <ModalContentWrapper
      icon={SupportedIcons.diamont}
      title="Name Your Account"
      subtitle="Please choose a name for your first account. You can edit your account name later."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center>
          <VStack width={300}>
            <FormControl isInvalid={!isValid && formState.isDirty}>
              <FormLabel>Account name</FormLabel>
              <Input
                type="text"
                {...register("accountName", {
                  required: false,
                })}
                placeholder="Optional"
              />
            </FormControl>

            <Button
              w="100%"
              size="lg"
              h="48px"
              type="submit"
              title="Submit"
              bg="umami.blue"
            >
              Continue
            </Button>
          </VStack>
        </Center>
      </form>
    </ModalContentWrapper>
  );
};

export default NameAccount;
