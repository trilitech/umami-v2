import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { DEFAULT_DERIVATION_PATH_PATTERN } from "../../../utils/account/derivationPathUtils";
import { AccountGroup, AccountGroupBuilder } from "../../helpers/AccountGroup";

export const v1BackedupAccountGroups = async () => {
  const expectedGroups: AccountGroup[] = [];
  // Seedphrase 5fd091e1
  let accountGroupBuilder = new AccountGroupBuilder("mnemonic", 1);
  accountGroupBuilder.setAllAccountNames("Account");
  await accountGroupBuilder.setSeedPhrase(mnemonic1.split(" "));
  accountGroupBuilder.setDerivationPathPattern(DEFAULT_DERIVATION_PATH_PATTERN.value);
  expectedGroups.push(await accountGroupBuilder.build());
  // Seedphrase 1b406abf
  const mnemonic =
    "top skirt fan helmet ankle pave original ivory push song bridge broom hawk food parade nation involve sunny rely security ladder beach gown imitate";
  accountGroupBuilder = new AccountGroupBuilder("mnemonic", 1);
  accountGroupBuilder.setAllAccountNames("Account");
  await accountGroupBuilder.setSeedPhrase(mnemonic.split(" "));
  accountGroupBuilder.setDerivationPathPattern(DEFAULT_DERIVATION_PATH_PATTERN.value);
  expectedGroups.push(await accountGroupBuilder.build());
  // TODO: add related multisig accounts.
  return expectedGroups;
};

export const v2BackedupAccountGroups = async () => {
  const expectedGroups: AccountGroup[] = [];
  // Seedphrase 5fd091e1
  let accountGroupBuilder = new AccountGroupBuilder("mnemonic", 5);
  accountGroupBuilder.setAccountName("Restored account 0", 0);
  accountGroupBuilder.setAccountName("Restored account 1", 1);
  accountGroupBuilder.setAccountName("Restored account 2", 2);
  accountGroupBuilder.setAccountName("htrthrh", 3);
  accountGroupBuilder.setAccountName("12asd", 4);
  await accountGroupBuilder.setSeedPhrase(mnemonic1.split(" "));
  accountGroupBuilder.setDerivationPathPattern(DEFAULT_DERIVATION_PATH_PATTERN.value);
  expectedGroups.push(await accountGroupBuilder.build());
  // Seedphrase fa3f3982
  const mnemonic2 =
    "cluster umbrella blade second miss margin jazz joke blur column bulk monkey wrestle spell day produce noble front alley kangaroo auction sight truck other";
  accountGroupBuilder = new AccountGroupBuilder("mnemonic", 1);
  accountGroupBuilder.setAccountName("test");
  await accountGroupBuilder.setSeedPhrase(mnemonic2.split(" "));
  accountGroupBuilder.setDerivationPathPattern(DEFAULT_DERIVATION_PATH_PATTERN.value);
  expectedGroups.push(await accountGroupBuilder.build());
  // Seedphrase 2263e19b
  const mnemonic3 =
    "few gauge word visa april now grace allow ozone box loop pudding clap barely loud casino ugly demise bottom urge toast fan wedding exclude";
  accountGroupBuilder = new AccountGroupBuilder("mnemonic", 1);
  accountGroupBuilder.setAccountName("test2");
  await accountGroupBuilder.setSeedPhrase(mnemonic3.split(" "));
  accountGroupBuilder.setDerivationPathPattern(DEFAULT_DERIVATION_PATH_PATTERN.value);
  expectedGroups.push(await accountGroupBuilder.build());
  // TODO: add ledger account
  // TODO: add related multisig accounts.
  return expectedGroups;
};
