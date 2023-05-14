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
import { Step, TemporaryAccountConfig } from "../useOnboardingModal";
import { useState } from "react";
import { getRelativeDerivationPath } from "../../../utils/restoreAccounts";

type ConfirmDerivationPathFormValues = {
  derivationPath: string;
  customPath: boolean;
};

export const DerivationPath = ({
  setStep,
  config
}: {
  setStep: (step: Step) => void;
  config: TemporaryAccountConfig
}) => {
  const { register, handleSubmit } = useForm<ConfirmDerivationPathFormValues>();
  const [isDefault, setIsDefault] = useState(false);

  const onSubmit = async (data: ConfirmDerivationPathFormValues) => {
    if (data.customPath) {
      config.derivationPath = data.derivationPath
    } else {
      config.derivationPath = getRelativeDerivationPath(0)
    }
    config.derivationType = "ed25519"
    setStep({ type: 'masterPassword', config })
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
              <HStack spacing='10px'>
                <Text fontWeight={'bold'}>Default Path</Text>
                <Switch {...register("customPath")} onChange={() => setIsDefault(!isDefault)} />
                <Text>Custom Path</Text>
              </HStack>
            </FormControl>
            <FormControl>
              <Input
                defaultValue={getRelativeDerivationPath(0)}
                isDisabled={!isDefault}
                {...register("derivationPath", {
                  required: true,
                })}
              />
            </FormControl>
            <Button
              w='100%'
              size='lg'
              type="submit"
              title="Restore accounts"
              bg='umami.blue'
            >
              Continue
            </Button>
          </VStack>
        </Center>
      </form>
    </ModalContentWrapper >
  );
};

export default DerivationPath;

