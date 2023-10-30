
import { useContext } from "react";
import { Account, AccountType } from "../../types/Account";
import RenameRemoveMenu from "../RenameRemoveMenu";
import { DynamicModalContext } from "../DynamicModal";
import { RenameAccountModal } from "./RenameAccountModal";

const RenameRemoveMenuSwitch: React.FC<{ account: Account }> = ({ account }) => {
  const { openWith } = useContext(DynamicModalContext);
  switch (account.type) {
    case AccountType.MNEMONIC:
    case AccountType.MULTISIG:
      return (
        <RenameRemoveMenu
          onRename={() => {
            if (account.type === AccountType.MULTISIG) {
              // TODO: Rename multisig account
              return;
            }
            openWith(<RenameAccountModal account={account} />)
          }}
        />
      );
    case AccountType.LEDGER:
    case AccountType.SOCIAL:
      return (
        <RenameRemoveMenu
          onRename={() => {
            openWith(<RenameAccountModal account={account} />)
          }}
          onRemove={() => {
            // TODO: Remove ledger/social account individually
          }}
        />
      );
  }
};

export default RenameRemoveMenuSwitch;

