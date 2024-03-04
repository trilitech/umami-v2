import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import { ConnectOptions } from "./connectOptions/ConnectOptions";
import { ConnectOrCreate } from "./connectOrCreate/ConnectOrCreate";
import { DerivationPath } from "./derivationPath/DerivationPath";
import { Eula } from "./eula/Eula";
import { FakeAccount } from "./FakeAccount";
import { MasterPassword } from "./masterPassword/MasterPassword";
import { NameAccount } from "./nameAccount/NameAccount";
import { Notice } from "./notice/Notice";
import { OnboardingStep } from "./OnboardingStep";
import { RestoreBackupFile } from "./restoreBackupFile/RestoreBackupFile";
import { RestoreLedger } from "./restoreLedger/RestoreLedger";
import { RestoreMnemonic } from "./restoreMnemonic/RestoreMnemonic";
import { RestoreSecretKey } from "./restoreSecretKey/RestoreSecretKey";
import { ShowSeedphrase } from "./showSeedphrase/ShowSeedphrase";
import { VerifySeedphrase } from "./verifySeedphrase/VerifySeedphrase";
import { useImplicitAccounts } from "../../utils/hooks/getAccountDataHooks";
import { ModalBackButton } from "../ModalBackButton";
import { useStepHistory } from "../useStepHistory";

export const useOnboardingModal = (onModalClose?: () => void) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hasAccounts = useImplicitAccounts().length !== 0;
  const history = useStepHistory<OnboardingStep>({
    type: hasAccounts ? "connectOrCreate" : "eula",
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
      case "eula":
        return <Eula goToStep={goToStep} />;
      case "connectOrCreate":
        return <ConnectOrCreate closeModal={closeModal} goToStep={goToStep} />;
      case "connectOptions":
        return <ConnectOptions goToStep={goToStep} />;
      case "notice":
        return <Notice goToStep={goToStep} />;
      case "restoreMnemonic":
        return <RestoreMnemonic goToStep={goToStep} />;
      case "restoreBackup":
        return <RestoreBackupFile />;
      case "showSeedphrase":
        return <ShowSeedphrase goToStep={goToStep} {...currentStep} />;
      case "verifySeedphrase":
        return <VerifySeedphrase goToStep={goToStep} {...currentStep} />;
      case "nameAccount":
        return <NameAccount goToStep={goToStep} {...currentStep} />;
      case "derivationPath":
        return <DerivationPath goToStep={goToStep} {...currentStep} />;
      case "restoreLedger":
        return <RestoreLedger closeModal={closeModal} {...currentStep} />;
      case "masterPassword":
        return <MasterPassword onClose={closeModal} {...currentStep} />;
      case "fakeAccount":
        return <FakeAccount onClose={onClose} />;
      case "restoreSecretKey":
        return <RestoreSecretKey goToStep={goToStep} />;
    }
  };

  return {
    modalElement: (
      <Modal
        autoFocus={false}
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={closeModal}
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
