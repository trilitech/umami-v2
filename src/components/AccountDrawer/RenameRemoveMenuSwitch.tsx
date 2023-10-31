import { useContext } from "react";
import { Account, AccountType } from "../../types/Account";
import RenameRemoveMenu from "../RenameRemoveMenu";
import { DynamicModalContext } from "../DynamicModal";
import { RenameAccountModal } from "./RenameAccountModal";
import { ConfirmationModal } from "../ConfirmationModal";
import { useAppDispatch } from "../../utils/redux/hooks";
import accountsSlice from "../../utils/redux/slices/accountsSlice";

const RenameRemoveMenuSwitch: React.FC<{ account: Account }> = ({ account }) => {
  const { openWith, onClose: onCloseModal } = useContext(DynamicModalContext);
  const dispatch = useAppDispatch();
  switch (account.type) {
    case AccountType.MNEMONIC:
    case AccountType.MULTISIG:
      return (
        <RenameRemoveMenu
          onRename={() => {
            openWith(<RenameAccountModal account={account} />);
          }}
        />
      );
    case AccountType.LEDGER:
    case AccountType.SOCIAL:
      return (
        <RenameRemoveMenu
          onRename={() => {
            openWith(<RenameAccountModal account={account} />);
          }}
          onRemove={() => {
            openWith(
              <ConfirmationModal
                title="Delete Account"
                buttonLabel="Delete Account"
                description="Are you sure you want to remove this account?"
                onSubmit={() => {
                  dispatch(accountsSlice.actions.removeAccount(account));
                  onCloseModal();
                  // TODO: close drawer
                }}
              />
            );
          }}
        />
      );
  }
};

export default RenameRemoveMenuSwitch;
