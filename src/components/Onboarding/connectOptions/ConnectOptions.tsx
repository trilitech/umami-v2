import { Button, VStack } from "@chakra-ui/react";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";
import LinkIcon from "../../../assets/icons/Link";

const ConnectOptions = ({ goToStep }: { goToStep: (step: Step) => void }) => {
  return (
    <ModalContentWrapper icon={<LinkIcon />} title="Connect or Import Account">
      <VStack w="100%" spacing="16px">
        <Button w="100%" size="lg" onClick={_ => goToStep({ type: StepType.restoreMnemonic })}>
          Import with Seed Phrase
        </Button>
        <Button
          w="100%"
          size="lg"
          variant="tertiary"
          onClick={_ => goToStep({ type: StepType.restoreSecretKey })}
        >
          Import with a Secret Key
        </Button>
        <Button
          variant="tertiary"
          w="100%"
          size="lg"
          onClick={_ => {
            goToStep({ type: StepType.restoreBackup });
          }}
        >
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
