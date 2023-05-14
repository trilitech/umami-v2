import {
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
// import ModalBackground from "../../assets/onboarding/modal_background.png";
import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useAccounts } from "../../utils/hooks/accountHooks";
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

export class TemporarySocialAccountConfig extends Base {}

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
  const hasAccounts = useAccounts().length !== 0;
  const [history, setHistory] = useState<Step[]>([]); // Setting default value

  useEffect(() => {
    if (step && history.map((s) => s.type).indexOf(step.type) === -1) {
      setHistory([...history, step]);
    }
    if (
      !step ||
      (step &&
        ["generateSeedphrase", "restoreSeedphrase", "eula"].indexOf(
          step?.type
        ) > -1)
    ) {
      setModalSize(ModalSize.lg);
    } else {
      setModalSize(ModalSize.md);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      case "connectOrCreate":
        return <ConnectOrCreate setStep={setStep} />;
      case "connectOptions":
        return <ConnectOptions setStep={setStep} />;
      case "notice":
        return <Notice setStep={setStep} />;
      case "restoreSeedphrase":
        return <RestoreSeedphrase setStep={setStep} />;
      case "generateSeedphrase":
        return <GenerateSeedphrase setStep={setStep} />;
      case "verifySeedphrase":
        return <VerifySeedphrase setStep={setStep} config={step.config} />;
      case "restoreLedger":
        return <RestoreLedger setStep={setStep} config={step.config} />;
      case "nameAccount":
        return <NameAccount setStep={setStep} config={step.config} />;
      case "derivationPath":
        return <DerivationPath setStep={setStep} config={step.config} />;
      case "masterPassword":
        return (
          <MasterPassword
            setStep={setStep}
            config={step.config}
            onClose={onClose}
          />
        );
      default:
        throw new Error("Unmatched case");
    }
  };

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          // bgImage={ModalBackground}
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
              position="absolute"
              variant="ghost"
              aria-label="Back"
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
              size="lg"
              right={0}
              position="absolute"
              variant="ghost"
              aria-label="Close"
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
