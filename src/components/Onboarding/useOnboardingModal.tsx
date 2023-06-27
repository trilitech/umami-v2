import { IconButton, Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import ModalBackground from "../../assets/onboarding/background_image.svg";
import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useImplicitAccounts } from "../../utils/hooks/accountHooks";
import ConnectOptions from "./connectOptions/ConnectOptions";
import ConnectOrCreate from "./connectOrCreate/ConnectOrCreate";
import Eula from "./eula/Eula";
import ShowSeedphrase from "./showSeedphrase/ShowSeedphrase";
import MasterPassword from "./masterPassword/MasterPassword";
import NameAccount from "./nameAccount/NameAccount";
import Notice from "./notice/Notice";
import RestoreLedger from "./restoreLedger/RestoreLedger";
import RestoreSeedphrase from "./restoreSeedphrase/RestoreSeedphrase";
import VerifySeedphrase from "./verifySeedphrase/VerifySeedphrase";
import DerivationPath from "./derivationPath/DerivationPath";

export enum StepType {
  eula = "eula",
  connectOrCreate = "connectOrCreate",
  connectOptions = "connectOptions",
  notice = "notice",
  restoreSeedphrase = "restoreSeedphrase",
  restoreLedger = "restoreLedger",
  showSeedphrase = "showSeedphrase",
  verifySeedphrase = "verifySeedphrase",
  nameAccount = "nameAccount",
  derivationPath = "derivationPath",
  masterPassword = "masterPassword",
}

export enum ModalSize {
  md = "420px",
  lg = "520px",
}

const stepModalSize = (step: Step): ModalSize => {
  if (["eula", "showSeedphrase", "verifySeedphrase"].includes(step.type)) {
    return ModalSize.lg;
  }
  return ModalSize.md;
};

export type EulaStep = { type: StepType.eula };
export type ConnectOrCreateStep = { type: StepType.connectOrCreate };
export type NoticeStep = { type: StepType.notice };
export type ConnectOptionsStep = { type: StepType.connectOptions };
export type ShowSeedphraseStep = {
  type: StepType.showSeedphrase;
  account: { type: "mnemonic"; seedphrase: string };
};
export type RestoreSeedphraseStep = { type: StepType.restoreSeedphrase };
export type VerifySeedphraseStep = {
  type: StepType.verifySeedphrase;
  account: { type: "mnemonic"; seedphrase: string };
};
export type NameAccountStep = {
  type: StepType.nameAccount;
  account: { type: "mnemonic"; seedphrase: string } | { type: "ledger" };
};
export type DerivationPathStep = {
  type: StepType.derivationPath;
  account:
    | { type: "mnemonic"; seedphrase: string; label: string }
    | { type: "ledger"; label: string };
};
export type RestoreLedgerStep = {
  type: StepType.restoreLedger;
  account: { type: "ledger"; label: string; derivationPath: string };
};
export type MasterPasswordStep = {
  type: StepType.masterPassword;
  account: { type: "mnemonic"; seedphrase: string; label: string; derivationPath: string };
};

export type Step =
  | EulaStep
  | ConnectOrCreateStep
  | NoticeStep
  | ConnectOptionsStep
  | ShowSeedphraseStep
  | RestoreSeedphraseStep
  | VerifySeedphraseStep
  | NameAccountStep
  | DerivationPathStep
  | RestoreLedgerStep
  | MasterPasswordStep;

export const useCreateOrImportSecretModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hasAccounts = useImplicitAccounts().length !== 0;
  const [step, setStep] = useState<Step>({
    type: hasAccounts ? StepType.connectOrCreate : StepType.eula,
  });
  const [history, setHistory] = useState<Step[]>([step]);

  const closeModal = () => {
    setStep(history[0]);
    setHistory([history[0]]);
    onClose();
  };

  const goToStep = (step: Step) => {
    setStep(step);
    setHistory([...history, step]);
  };

  const getStepPage = () => {
    switch (step.type) {
      case StepType.eula:
        return <Eula goToStep={goToStep} />;
      case StepType.connectOrCreate:
        return <ConnectOrCreate goToStep={goToStep} closeModal={closeModal} />;
      case StepType.connectOptions:
        return <ConnectOptions goToStep={goToStep} />;
      case StepType.notice:
        return <Notice goToStep={goToStep} />;
      case StepType.restoreSeedphrase:
        return <RestoreSeedphrase goToStep={goToStep} />;
      case StepType.showSeedphrase:
        return <ShowSeedphrase goToStep={goToStep} {...step} />;
      case StepType.verifySeedphrase:
        return <VerifySeedphrase goToStep={goToStep} {...step} />;
      case StepType.nameAccount:
        return <NameAccount goToStep={goToStep} {...step} />;
      case StepType.derivationPath:
        return <DerivationPath goToStep={goToStep} {...step} />;
      case StepType.restoreLedger:
        return <RestoreLedger closeModal={closeModal} {...step} />;
      case StepType.masterPassword:
        return <MasterPassword onClose={onClose} {...step} />;
    }
  };

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay
          bgImage={hasAccounts ? undefined : ModalBackground}
          bgColor={hasAccounts ? undefined : "#0A0A0A"}
          backdropFilter="blur(5px)"
          bgPosition="center"
          bgSize="cover"
        />
        <ModalContent
          bg="umami.gray.900"
          maxW={stepModalSize(step)}
          minW={stepModalSize(step)}
          border="1px solid #282828"
          boxShadow="0px 0px 15px 1px rgba(235, 235, 235, 0.1);"
        >
          {history.length > 1 && (
            <IconButton
              size="lg"
              top="4px"
              left="4px"
              position="absolute"
              variant="ghost"
              aria-label="Back"
              color="umami.gray.450"
              icon={<ArrowBackIcon />}
              onClick={() => {
                history.pop();
                const previous = history[history.length - 1];
                setHistory(history);
                setStep(previous);
              }}
            />
          )}
          <IconButton
            size="sm"
            top="8px"
            right="8px"
            position="absolute"
            variant="ghost"
            aria-label="Close"
            color="umami.gray.450"
            icon={<CloseIcon />}
            onClick={closeModal}
          />
          {getStepPage()}
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};
