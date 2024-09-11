import { logout } from "@umami/state";

import { persistor } from "../../utils/persistor";
import { ConfirmationModal } from "../ConfirmationModal";

export const LogoutModal = () => (
  <ConfirmationModal
    buttonLabel="Logout"
    description="Are you sure you want to logout?"
    onSubmit={() => logout(persistor)}
    title="Logout"
  />
);
