import { Button, VStack } from "@chakra-ui/react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import {
  Step,
  StepType,
  TemporaryLedgerAccountConfig,
} from "../useOnboardingModal";

const ConnectOptions = ({ setStep }: { setStep: (step: Step) => void }) => {
  return (
    <ModalContentWrapper icon={SupportedIcons.wallet} title="Connect Options">
      <VStack w="100%" spacing={4}>
        <Button
          bg="umami.blue"
          w="100%"
          size="lg"
          onClick={(_) => setStep({ type: StepType.restoreSeedphrase })}
        >
          Import with Seed Phrase
        </Button>
        <Button variant="outline" w="100%" size="lg" disabled={true}>
          Restore from Backup
        </Button>
        <Button
          w="100%"
          variant="ghost"
          onClick={(_) => {
            setStep({
              type: StepType.derivationPath,
              config: new TemporaryLedgerAccountConfig(),
            });
          }}
        >
          Connect ledger
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};

export default ConnectOptions;
