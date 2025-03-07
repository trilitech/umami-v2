import { logout } from "@umami/state";

import { persistor } from "../../utils/persistor";
import { getRemoveDefaultAccountDescription } from "../AccountSelectorModal/RemoveAccountModal";
import { ConfirmationModal } from "../ConfirmationModal";

export const LogoutModal = () => (
  <ConfirmationModal
    buttonLabel="Log out"
    description={getRemoveDefaultAccountDescription("seedphrase")}
    onSubmit={() => persistor && logout(persistor)}
    title="Log out"
  />
);
