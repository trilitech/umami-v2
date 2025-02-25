import { logout } from "@umami/state";

import { persistor } from "../../utils/persistor";
import { ConfirmationModal } from "../ConfirmationModal";

export const LogoutModal = () => (
  <ConfirmationModal
    buttonLabel="Log out"
    description="Before you log out, ensure your mnemonic phrase is securely saved. Without it, you may permanently lose access to your account and data."
    onSubmit={() => persistor && logout(persistor)}
    title="Log out"
  />
);
