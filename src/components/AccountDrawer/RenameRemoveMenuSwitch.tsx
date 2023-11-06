import { useContext } from "react";
import { Account, AccountType } from "../../types/Account";
import RenameRemoveMenu from "../RenameRemoveMenu";
import { DynamicModalContext } from "../DynamicModal";
import { RenameAccountModal } from "./RenameAccountModal";
import { ConfirmationModal } from "../ConfirmationModal";
import { useAppDispatch } from "../../utils/redux/hooks";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import { useNavigate } from "react-router-dom";

const RenameRemoveMenuSwitch: React.FC<{ account: Account }> = ({ account }) => {
  const { openWith, onClose: closeModal } = useContext(DynamicModalContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
                title="Remove Account"
                buttonLabel="Remove Account"
                description="Are you sure you want to remove this account?"
                onSubmit={() => {
                  dispatch(accountsSlice.actions.removeAccount(account));
                  closeModal();
                  navigate("/");
                }}
              />
            );
          }}
        />
      );
  }
};

export default RenameRemoveMenuSwitch;
