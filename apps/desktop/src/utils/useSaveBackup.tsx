import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@chakra-ui/react";
import { useDownloadBackupFile } from "@umami/state";

import { MasterPassword } from "../components/Onboarding/masterPassword/MasterPassword";

export const useSaveBackup = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const downloadBackupFile = useDownloadBackupFile();

  return {
    content: (
      <Modal
        autoFocus={false}
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <MasterPassword
            onClose={onClose}
            onVerify={password => downloadBackupFile(password).then(onClose)}
          />
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};
