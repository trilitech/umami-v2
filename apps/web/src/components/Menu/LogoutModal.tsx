import { logout } from "@umami/state";

import { persistor } from "../../utils/persistor";
import { ConfirmationModal } from "../ConfirmationModal";

export const LogoutModal = () => (
  <ConfirmationModal
    buttonLabel="Logout"
    description="Before logging out, make sure your mnemonic phrase is securely saved. Losing this phrase could result in permanent loss of access to your data."
    onSubmit={() => logout(persistor)}
    title="Logout"
  />
);
