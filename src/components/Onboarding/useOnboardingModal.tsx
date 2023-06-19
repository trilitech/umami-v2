import { IconButton, Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import ModalBackground from "../../assets/onboarding/background_image.svg";
import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import { useImplicitAccounts } from "../../utils/hooks/accountHooks";
import ConnectOptions from "./connectOptions/ConnectOptions";
import ConnectOrCreate from "./connectOrCreate/ConnectOrCreate";
import Eula from "./eula/Eula";
import { GenerateSeedphrase } from "./generateSeedphrase/GenerateSeedphrase";
import MasterPassword from "./masterPassword/MasterPassword";
import NameAccount from "./nameAccount/NameAccount";
import Notice from "./notice/Notice";
import RestoreLedger from "./restoreLedger/RestoreLedger";
import RestoreSeedphrase from "./restoreSeedphrase/RestoreSeedphrase";
import VerifySeedphrase from "./verifySeedphrase/VerifySeedphrase";
import DerivationPath from "./derivationPath/DerivationPath";

abstract class Base {
  label?: string;
}

export class TemporaryMnemonicAccountConfig extends Base {
  seedphrase?: string;
  derivationPath?: string;
}
export class TemporaryLedgerAccountConfig extends Base {
  derivationPath?: string;
  pk?: string;
  pkh?: string;
}

export class TemporarySocialAccountConfig extends Base {
  pk?: string;
  pkh?: string;
}

export type TemporaryAccountConfig =
  | TemporaryMnemonicAccountConfig
  | TemporaryLedgerAccountConfig
  | TemporarySocialAccountConfig;

export enum StepType {
  eula = "eula",
  connectOrCreate = "connectOrCreate",
  connectOptions = "connectOptions",
  notice = "notice",
  restoreSeedphrase = "restoreSeedphrase",
  restoreLedger = "restoreLedger",
  generateSeedphrase = "generateSeedphrase",
  verifySeedphrase = "verifySeedphrase",
  nameAccount = "nameAccount",
  derivationPath = "derivationPath",
  masterPassword = "masterPassword",
}

export type Step =
  | { type: StepType.eula }
  | { type: StepType.connectOrCreate }
  | { type: StepType.connectOptions }
  | { type: StepType.notice }
  | { type: StepType.restoreSeedphrase }
  | { type: StepType.generateSeedphrase }
  | { type: StepType.restoreLedger; config: TemporaryLedgerAccountConfig }
  | { type: StepType.verifySeedphrase; config: TemporaryMnemonicAccountConfig }
  | { type: StepType.nameAccount; config: TemporaryAccountConfig }
  | {
      type: StepType.derivationPath;
      config: TemporaryMnemonicAccountConfig | TemporaryLedgerAccountConfig;
    }
  | { type: StepType.masterPassword; config: TemporaryAccountConfig };

export enum ModalSize {
  md = "420px",
  lg = "520px",
}

export const useCreateOrImportSecretModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalSize, setModalSize] = useState<ModalSize>(ModalSize.md);
  const [step, setStep] = useState<Step | null>(null);
  const hasAccounts = useImplicitAccounts().length !== 0;
  const [history, setHistory] = useState<Step[]>([{ type: StepType.connectOrCreate }]);
  const historyRef = useRef(history);

  useEffect(() => {
    if (step && historyRef.current.map(s => s.type).indexOf(step.type) === -1) {
      setHistory([...historyRef.current, step]);
    }
    if (
      !step ||
      (step && ["generateSeedphrase", "restoreSeedphrase", "eula"].indexOf(step?.type) > -1)
    ) {
      setModalSize(ModalSize.lg);
    } else {
      setModalSize(ModalSize.md);
    }
  }, [step, step?.type]);

  const logic = () => {
    if (!step) {
      if (hasAccounts) {
        return <ConnectOrCreate setStep={setStep} />;
      } else {
        return <Eula setStep={setStep} />;
      }
    }
    switch (step.type) {
      case StepType.connectOrCreate:
        return <ConnectOrCreate setStep={setStep} />;
      case StepType.connectOptions:
        return <ConnectOptions setStep={setStep} />;
      case StepType.eula:
        return <Eula setStep={setStep} />;
      case StepType.notice:
        return <Notice setStep={setStep} />;
      case StepType.restoreSeedphrase:
        return <RestoreSeedphrase setStep={setStep} />;
      case StepType.generateSeedphrase:
        return <GenerateSeedphrase setStep={setStep} />;
      case StepType.verifySeedphrase:
        return <VerifySeedphrase setStep={setStep} config={step.config} />;
      case StepType.restoreLedger:
        return <RestoreLedger setStep={setStep} config={step.config} />;
      case StepType.nameAccount:
        return <NameAccount setStep={setStep} config={step.config} />;
      case StepType.derivationPath:
        return <DerivationPath setStep={setStep} config={step.config} />;
      case StepType.masterPassword:
        return <MasterPassword config={step.config} onClose={onClose} />;
      default: {
        const error: never = step;
        throw new Error(error);
      }
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
          maxW={modalSize}
          minW={modalSize}
          border="1px solid #282828"
          boxShadow="0px 0px 15px 1px rgba(235, 235, 235, 0.1);"
        >
          {history.length > 1 ? (
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
                const previous = history.pop();
                setHistory(history);
                if (previous) setStep(previous);
              }}
            />
          ) : (
            <IconButton
              size="sm"
              top="8px"
              right="8px"
              position="absolute"
              variant="ghost"
              aria-label="Close"
              color="umami.gray.450"
              icon={<CloseIcon />}
              onClick={onClose}
            />
          )}
          {logic()}
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};
