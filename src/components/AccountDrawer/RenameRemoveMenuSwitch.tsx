import { Account, AccountType } from "../../types/Account";
import RenameRemoveMenu from "../RenameRemoveMenu";

const RenameRemoveMenuSwitch: React.FC<{ account: Account }> = ({ account }) => {
  switch (account.type) {
    case AccountType.MNEMONIC:
      return (
        <RenameRemoveMenu
          onRename={() => {
            // TODO: Rename mnemonic account
          }}
        />
      );
    case AccountType.MULTISIG:
      return (
        <RenameRemoveMenu
          onRename={() => {
            // TODO: store a mapping from a multisig contract to name locally
          }}
        />
      );
    case AccountType.LEDGER:
    case AccountType.SOCIAL:
      return (
        <RenameRemoveMenu
          onRename={() => {
            // TODO: Rename ledger/social account
          }}
          onRemove={() => {
            // TODO: Remove ledger/social account individually
          }}
        />
      );
  }
};

export default RenameRemoveMenuSwitch;
