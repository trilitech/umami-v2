import { Button, Center, FormControl, Text, Switch, VStack, Input, HStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import ModalContentWrapper from "../ModalContentWrapper";
import { SupportedIcons } from "../../CircleIcon";
import { DerivationPathStep, Step, StepType } from "../useOnboardingModal";
import { useState } from "react";
import { defaultV1Pattern, ledgerPattern } from "../../../utils/account/derivationPathUtils";

type ConfirmDerivationPathFormValues = {
  derivationPath: string;
};

export const DerivationPath = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: DerivationPathStep["account"];
}) => {
  const { register, handleSubmit } = useForm<ConfirmDerivationPathFormValues>();
  const [useDefault, setUseDefault] = useState(true);
  const getDefaultDerivationPath = () => {
    switch (account.type) {
      case "ledger":
        return ledgerPattern;
      case "mnemonic":
        return defaultV1Pattern;
    }
  };

  const onSubmit = async (data: ConfirmDerivationPathFormValues) => {
    const derivationPath = useDefault ? getDefaultDerivationPath() : data.derivationPath;

    switch (account.type) {
      case "ledger":
        goToStep({ type: StepType.restoreLedger, account: { ...account, derivationPath } });
        break;
      case "mnemonic":
        goToStep({ type: StepType.masterPassword, account: { ...account, derivationPath } });
        break;
    }
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
                <Text fontWeight="bold">Default Path</Text>
                <Switch data-testid="switch" onChange={() => setUseDefault(!useDefault)} />
                <Text>Custom Path</Text>
              </HStack>
            </FormControl>
            <FormControl>
              {/* TODO: Add derivationPath regex matching check! */}
              <Input
                data-testid="custom-path"
                defaultValue={getDefaultDerivationPath()}
                isDisabled={useDefault}
                {...register("derivationPath", {
                  required: false,
                })}
              />
            </FormControl>
            <Button w="100%" size="lg" type="submit" title="Restore accounts" bg="umami.blue">
              Continue
            </Button>
          </VStack>
        </Center>
      </form>
    </ModalContentWrapper>
  );
};

export default DerivationPath;
