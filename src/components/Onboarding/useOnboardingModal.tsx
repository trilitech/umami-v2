import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useImplicitAccounts } from "../../utils/hooks/setAccountDataHooks";
import ConnectOptions from "./connectOptions/ConnectOptions";
import ConnectOrCreate from "./connectOrCreate/ConnectOrCreate";
import Eula from "./eula/Eula";
import ShowSeedphrase from "./showSeedphrase/ShowSeedphrase";
import MasterPassword from "./masterPassword/MasterPassword";
import NameAccount from "./nameAccount/NameAccount";
import Notice from "./notice/Notice";
import RestoreLedger from "./restoreLedger/RestoreLedger";
import VerifySeedphrase from "./verifySeedphrase/VerifySeedphrase";
import DerivationPath from "./derivationPath/DerivationPath";
import { useStepHistory } from "../useStepHistory";
import { FakeAccount } from "./FakeAccount";
import { ModalBackButton } from "../ModalBackButton";
import RestoreMnemonic from "./restoreMnemonic/RestoreMnemonic";
import RestoreBackupFile from "./restoreBackupFile/RestoreBackupFile";
import { RestoreSecretKey } from "./restoreSecretKey/RestoreSecretKey";

export enum StepType {
  eula = "eula",
  connectOrCreate = "connectOrCreate",
  connectOptions = "connectOptions",
  notice = "notice",
  restoreMnemonic = "restoreMnemonic",
  restoreSecretKey = "restoreSecretKey",
  restoreLedger = "restoreLedger",
  restoreBackup = "restoreBackup",
  showSeedphrase = "showSeedphrase",
  verifySeedphrase = "verifySeedphrase",
  nameAccount = "nameAccount",
  derivationPath = "derivationPath",
  masterPassword = "masterPassword",
  fakeAccount = "fakeAccount",
}

export type EulaStep = { type: StepType.eula };
export type ConnectOrCreateStep = { type: StepType.connectOrCreate };
export type NoticeStep = { type: StepType.notice };
export type ConnectOptionsStep = { type: StepType.connectOptions };
export type ShowSeedphraseStep = {
  type: StepType.showSeedphrase;
  account: { type: "mnemonic"; mnemonic: string };
};
export type RestoreSeedphraseStep = { type: StepType.restoreMnemonic };
export type RestoreSecretKeyStep = { type: StepType.restoreSecretKey };
export type VerifySeedphraseStep = {
  type: StepType.verifySeedphrase;
  account: { type: "mnemonic"; mnemonic: string };
};
export type NameAccountStep = {
  type: StepType.nameAccount;
  account:
    | { type: "mnemonic"; mnemonic: string }
    | { type: "ledger" }
    | { type: "secret_key"; secretKey: string };
};
export type DerivationPathStep = {
  type: StepType.derivationPath;
  account:
    | { type: "mnemonic"; mnemonic: string; label: string }
    | { type: "ledger"; label: string };
};
export type RestoreLedgerStep = {
  type: StepType.restoreLedger;
  account: { type: "ledger"; label: string; derivationPath: string };
};
export type RestoreBackup = {
  type: StepType.restoreBackup;
};
export type MasterPasswordStep = {
  type: StepType.masterPassword;
  account:
    | { type: "mnemonic"; mnemonic: string; label: string; derivationPath: string }
    | { type: "secret_key"; secretKey: string; label: string };
};
export type FakeAccountStep = { type: StepType.fakeAccount };

export type Step =
  | EulaStep
  | ConnectOrCreateStep
  | NoticeStep
  | ConnectOptionsStep
  | ShowSeedphraseStep
  | RestoreSeedphraseStep
  | RestoreSecretKeyStep
  | VerifySeedphraseStep
  | NameAccountStep
  | DerivationPathStep
  | RestoreLedgerStep
  | RestoreBackup
  | MasterPasswordStep
  | FakeAccountStep;

export const useOnboardingModal = (onModalClose?: () => void) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hasAccounts = useImplicitAccounts().length !== 0;
  const history = useStepHistory<Step>({
    type: hasAccounts ? StepType.connectOrCreate : StepType.eula,
  });
  const { currentStep, goToStep } = history;

  const closeModal = () => {
    history.reset();
    if (onModalClose) {
      onModalClose();
    }
    onClose();
  };

  const getStepPage = () => {
    switch (currentStep.type) {
      case StepType.eula:
        return <Eula goToStep={goToStep} />;
      case StepType.connectOrCreate:
        return <ConnectOrCreate goToStep={goToStep} closeModal={closeModal} />;
      case StepType.connectOptions:
        return <ConnectOptions goToStep={goToStep} />;
      case StepType.notice:
        return <Notice goToStep={goToStep} />;
      case StepType.restoreMnemonic:
        return <RestoreMnemonic goToStep={goToStep} />;
      case StepType.restoreBackup:
        return <RestoreBackupFile />;
      case StepType.showSeedphrase:
        return <ShowSeedphrase goToStep={goToStep} {...currentStep} />;
      case StepType.verifySeedphrase:
        return <VerifySeedphrase goToStep={goToStep} {...currentStep} />;
      case StepType.nameAccount:
        return <NameAccount goToStep={goToStep} {...currentStep} />;
      case StepType.derivationPath:
        return <DerivationPath goToStep={goToStep} {...currentStep} />;
      case StepType.restoreLedger:
        return <RestoreLedger closeModal={closeModal} {...currentStep} />;
      case StepType.masterPassword:
        return <MasterPassword onClose={onClose} {...currentStep} />;
      case StepType.fakeAccount:
        return <FakeAccount onClose={onClose} />;
      case StepType.restoreSecretKey:
        return <RestoreSecretKey goToStep={goToStep} />;
    }
  };

  return {
    modalElement: (
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        closeOnOverlayClick={false}
        isCentered
        autoFocus={false}
      >
        {hasAccounts && <ModalOverlay />}
        <ModalContent>
          {!history.atInitialStep && <ModalBackButton onClick={history.goBack} />}
          <ModalCloseButton onClick={closeModal} />
          {getStepPage()}
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};
