import {
  Button,
  Center,
  FormControl,
  Text,
  Switch,
  VStack,
  Input,
  HStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import ModalContentWrapper from "../ModalContentWrapper";
import { SupportedIcons } from "../../CircleIcon";
import {
  Step,
  StepType,
  TemporaryLedgerAccountConfig,
  TemporaryMnemonicAccountConfig,
} from "../useOnboardingModal";
import { useState } from "react";
import {
  getFullDerivationPath,
  getRelativeDerivationPath,
} from "../../../utils/restoreAccounts";

type ConfirmDerivationPathFormValues = {
  derivationPath: string;
  customPath: boolean;
};

export const DerivationPath = ({
  setStep,
  config,
}: {
  setStep: (step: Step) => void;
  config: TemporaryMnemonicAccountConfig | TemporaryLedgerAccountConfig;
}) => {
  const { register, handleSubmit } = useForm<ConfirmDerivationPathFormValues>();
  const [isDefault, setIsDefault] = useState(false);
  const getDefaultDerivationPath = () => {
    if (config instanceof TemporaryLedgerAccountConfig) {
      return getRelativeDerivationPath(0);
    } else {
      return getFullDerivationPath(0);
    }
  };

  const onSubmit = async (data: ConfirmDerivationPathFormValues) => {
    if (data.customPath) {
      config.derivationPath = data.derivationPath;
    } else {
      config.derivationPath = getDefaultDerivationPath();
    }
    if (config instanceof TemporaryMnemonicAccountConfig) {
      setStep({ type: StepType.masterPassword, config });
      return;
    } else if (config instanceof TemporaryLedgerAccountConfig) {
      setStep({ type: StepType.restoreLedger, config });
      return;
    }
    const error: never = config;
    throw new Error(error);
  };

  return (
    <ModalContentWrapper
      icon={SupportedIcons.diamont}
      title="Derivation Path"
      subtitle="Choose a custom derivation path or select the default derivation path and use the default key."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center>
          <VStack spacing={5}>
            <FormControl>
              <HStack spacing="10px">
                <Text fontWeight={"bold"}>Default Path</Text>
                <Switch
                  {...register("customPath")}
                  onChange={() => setIsDefault(!isDefault)}
                />
                <Text>Custom Path</Text>
              </HStack>
            </FormControl>
            <FormControl>
              <Input
                defaultValue={getDefaultDerivationPath()}
                isDisabled={!isDefault}
                {...register("derivationPath", {
                  required: false,
                })}
              />
            </FormControl>
            <Button
              w="100%"
              size="lg"
              type="submit"
              title="Restore accounts"
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

export default DerivationPath;
