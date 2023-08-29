import { Button, VStack } from "@chakra-ui/react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

const ConnectOptions = ({ goToStep }: { goToStep: (step: Step) => void }) => {
  return (
    <ModalContentWrapper icon={SupportedIcons.wallet} title="Connect Options">
      <VStack w="100%" spacing={4}>
        <Button w="100%" size="lg" onClick={_ => goToStep({ type: StepType.restoreMnemonic })}>
          Import with Seed Phrase
        </Button>
        <Button variant="tertiary" w="100%" size="lg" isDisabled>
          Restore from Backup
        </Button>
        <Button
          w="100%"
          size="lg"
          variant="tertiary"
          onClick={_ => {
            goToStep({ type: StepType.nameAccount, account: { type: "ledger" } });
          }}
        >
          Connect ledger
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};

export default ConnectOptions;
