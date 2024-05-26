import { FieldValues, Path } from "react-hook-form";

import { AddressAutocomplete } from "./AddressAutocomplete";
import { BaseProps } from "./BaseProps";
import { useContactsForSelectedNetwork } from "../../utils/hooks/contactsHooks";
import { useAllAccounts } from "../../utils/hooks/getAccountDataHooks";

export const KnownAccountsAutocomplete = <T extends FieldValues, U extends Path<T>>(
  props: BaseProps<T, U>
) => {
  const contacts = useContactsForSelectedNetwork();

  const accounts = useAllAccounts().map(account => ({
    name: account.label,
    pkh: account.address.pkh,
  }));

  return <AddressAutocomplete {...props} contacts={contacts.concat(accounts)} />;
};
