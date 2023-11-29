import { Button, VStack } from "@chakra-ui/react";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";
import { LinkIcon } from "../../../assets/icons";

export const ConnectOptions = ({ goToStep }: { goToStep: (step: Step) => void }) => {
  return (
    <ModalContentWrapper icon={<LinkIcon />} title="Connect or Import Account">
      <VStack width="100%" spacing="16px">
        <Button width="100%" onClick={_ => goToStep({ type: StepType.restoreMnemonic })} size="lg">
          Import with Seed Phrase
        </Button>
        <Button
          width="100%"
          onClick={_ => goToStep({ type: StepType.restoreSecretKey })}
          size="lg"
          variant="tertiary"
        >
          Import with a Secret Key
        </Button>
        <Button
          width="100%"
          onClick={_ => {
            goToStep({ type: StepType.restoreBackup });
          }}
          size="lg"
          variant="tertiary"
        >
          Restore from Backup
        </Button>
        <Button
          width="100%"
          onClick={_ => {
            goToStep({ type: StepType.nameAccount, account: { type: "ledger" } });
          }}
          size="lg"
          variant="tertiary"
        >
          Connect ledger
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};
