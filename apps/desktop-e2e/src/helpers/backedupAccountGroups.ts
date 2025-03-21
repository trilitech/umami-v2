import { mnemonic1 } from "@umami/test-utils";
import { DEFAULT_DERIVATION_PATH_TEMPLATE } from "@umami/tezos";

import { type AccountGroup, AccountGroupBuilder } from "./AccountGroup";

export const v2BackedupAccountGroups = async () => {
  const expectedGroups: AccountGroup[] = [];
  // Seedphrase 5fd091e1
  let accountGroupBuilder = new AccountGroupBuilder("mnemonic", 5);
  accountGroupBuilder.setAccountName("Restored account 0", 0);
  accountGroupBuilder.setAccountName("Restored account 1", 1);
  accountGroupBuilder.setAccountName("Restored account 2", 2);
  accountGroupBuilder.setAccountName("htrthrh", 3);
  accountGroupBuilder.setAccountName("12asd", 4);
  accountGroupBuilder.setSeedPhrase(mnemonic1.split(" "));
  accountGroupBuilder.setDerivationPathTemplate(DEFAULT_DERIVATION_PATH_TEMPLATE.value);
  expectedGroups.push(await accountGroupBuilder.build());
  // Seedphrase fa3f3982
  const mnemonic2 =
    "cluster umbrella blade second miss margin jazz joke blur column bulk monkey wrestle spell day produce noble front alley kangaroo auction sight truck other";
  accountGroupBuilder = new AccountGroupBuilder("mnemonic", 1);
  accountGroupBuilder.setAccountName("test");
  accountGroupBuilder.setSeedPhrase(mnemonic2.split(" "));
  accountGroupBuilder.setDerivationPathTemplate(DEFAULT_DERIVATION_PATH_TEMPLATE.value);
  expectedGroups.push(await accountGroupBuilder.build());
  // Seedphrase 2263e19b
  const mnemonic3 =
    "few gauge word visa april now grace allow ozone box loop pudding clap barely loud casino ugly demise bottom urge toast fan wedding exclude";
  accountGroupBuilder = new AccountGroupBuilder("mnemonic", 1);
  accountGroupBuilder.setAccountName("test2");
  accountGroupBuilder.setSeedPhrase(mnemonic3.split(" "));
  accountGroupBuilder.setDerivationPathTemplate(DEFAULT_DERIVATION_PATH_TEMPLATE.value);
  expectedGroups.push(await accountGroupBuilder.build());
  // TODO: add ledger account
  // TODO: add related multisig accounts.
  return expectedGroups;
};
