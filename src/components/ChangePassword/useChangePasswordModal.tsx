import { Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import colors from "../../style/colors";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch } from "../../utils/redux/hooks";
import changeMnemonicPassword from "../../utils/redux/thunks/changeMnemonicPassword";
import ChangePasswordFrom from "./ChangePasswordForm";

export const useChangePasswordModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const onSubmitChangePassword = (currentPassword: string, newPassword: string) =>
    handleAsyncAction(async () => {
      await dispatch(changeMnemonicPassword({ currentPassword, newPassword })).unwrap();
      onClose();
    });

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={colors.gray[900]}>
          <ChangePasswordFrom
            onSubmitChangePassword={onSubmitChangePassword}
            isLoading={isLoading}
          />
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};

export default useChangePasswordModal;
