import {
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import ModalBackground from "../../assets/onboarding/modal_background.png"
import { ArrowBackIcon, CloseIcon } from '@chakra-ui/icons'
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


export type TemporaryAccountConfig = {
  label?: string
  seedphrase: string
  derivationPath?: string
  derivationType?: string
}

export type Step =
  | { type: "eula" }
  | { type: "connectOrCreate" }
  | { type: "connectOptions" }
  | { type: "notice" }
  | { type: "restoreSeedphrase" }
  | { type: "restoreLedger" }
  | { type: "generateSeedphrase" }
  | { type: "verifySeedphrase", config: TemporaryAccountConfig }
  | { type: "nameAccount", config: TemporaryAccountConfig }
  | { type: "derivationPath", config: TemporaryAccountConfig }
  | { type: "masterPassword", config: TemporaryAccountConfig }

export enum ModalSize {
  md = "420px",
  lg = "520px",
}


export const useCreateOrImportSecretModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalSize, setModalSize] = useState<ModalSize>(ModalSize.md);
  const [step, setStep] = useState<Step | null>(null);
  const hasAccounts = useAccounts().length !== 0;
  let back: Step | null = null

  useEffect(() => {
    console.log('step', step?.type)
    if (!step || (step && ['generateSeedphrase', 'restoreSeedphrase', 'eula'].indexOf(step?.type) > -1)) {
      setModalSize(ModalSize.lg)
    } else {
      setModalSize(ModalSize.md)
    }
  }, [step, step?.type])

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
        back = { type: 'connectOrCreate' }
        return <ConnectOptions setStep={setStep} />
      case "notice":
        back = { type: 'connectOrCreate' }
        return <Notice setStep={setStep} />
      case "restoreSeedphrase":
        return <RestoreSeedphrase setStep={setStep} />
      case "restoreLedger":
        return <RestoreLedger setStep={setStep} />
      case "generateSeedphrase":
        back = { type: 'notice' }
        return <GenerateSeedphrase setStep={setStep} />
      case "verifySeedphrase":
        back = { type: 'generateSeedphrase' }
        return <VerifySeedphrase setStep={setStep} config={step.config} />
      case "nameAccount":
        return <NameAccount setStep={setStep} config={step.config} />
      case "derivationPath":
        return <DerivationPath setStep={setStep} config={step.config} />
      case "masterPassword":
        return <MasterPassword setStep={setStep} config={step.config} onClose={onClose} />
      default:
        throw new Error("Unmatched case")
    }
  }

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          // bgImage={ModalBackground}
          backdropFilter='blur(5px)'
          bgPosition="center"
          bgSize="cover"
        />
        <ModalContent
          bg="umami.gray.900"
          maxW={modalSize}
          minW={modalSize}
          border="1px solid #282828"
          boxShadow='0px 0px 15px 1px rgba(235, 235, 235, 0.1);'
        >
          {back ? (
            <IconButton
              size='lg'
              position='absolute'
              variant='ghost'
              aria-label='Back'
              icon={<ArrowBackIcon />}
              onClick={() => {
                if (back) {
                  setStep(back)
                } else {
                  onClose()
                }
              }}
            />
          ) : (
            <IconButton
              size='lg'
              right={0}
              position='absolute'
              variant='ghost'
              aria-label='Close'
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
