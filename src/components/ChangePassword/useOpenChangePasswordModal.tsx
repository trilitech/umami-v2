import { useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch } from "../../utils/redux/hooks";
import changeMnemonicPassword from "../../utils/redux/thunks/changeMnemonicPassword";
import { DynamicModalContext } from "../DynamicModal";
import ChangePasswordFrom from "./ChangePasswordForm";

export const useOpenChangePasswordModal = () => {
  const dispatch = useAppDispatch();
  const { onClose, openWith } = useContext(DynamicModalContext);
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const toast = useToast();

  const onSubmitChangePassword = (currentPassword: string, newPassword: string) =>
    handleAsyncAction(async () => {
      await dispatch(changeMnemonicPassword({ currentPassword, newPassword })).unwrap();
      toast({ title: "Password updated", status: "success" });
      onClose();
    });

  return () =>
    openWith(
      <ChangePasswordFrom onSubmitChangePassword={onSubmitChangePassword} isLoading={isLoading} />
    );
};

export default useOpenChangePasswordModal;
