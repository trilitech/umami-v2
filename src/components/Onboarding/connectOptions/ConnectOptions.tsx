import { Button, VStack } from "@chakra-ui/react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

const ConnectOptions = ({ goToStep }: { goToStep: (step: Step) => void }) => {
  return (
    <ModalContentWrapper icon={SupportedIcons.wallet} title="Connect Options">
      <VStack w="100%" spacing={4}>
        <Button
          bg="umami.blue"
          w="100%"
          size="lg"
          onClick={_ => goToStep({ type: StepType.restoreMnemonic })}
        >
          Import with Seed Phrase
        </Button>
        <Button variant="outline" w="100%" size="lg" disabled={true}>
          Restore from Backup
        </Button>
        <Button
          w="100%"
          variant="ghost"
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
