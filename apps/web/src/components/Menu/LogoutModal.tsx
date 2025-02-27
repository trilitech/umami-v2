import { logout } from "@umami/state";

import { persistor } from "../../utils/persistor";
import { removeDefaultAccountDescription } from "../AccountSelectorModal/RemoveAccountModal";
import { ConfirmationModal } from "../ConfirmationModal";

export const LogoutModal = () => {
  // use the description removeDefaultAccountDescription from RemoveAccountModal
  const description = removeDefaultAccountDescription;

  return (
    <ConfirmationModal
      buttonLabel="Log out"
      description={description("seedphrase")}
      onSubmit={() => persistor && logout(persistor)}
      title="Log out"
    />
  );
};
