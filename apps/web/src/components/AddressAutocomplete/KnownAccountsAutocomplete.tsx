import { useContactsForSelectedNetwork, useImplicitAccounts } from "@umami/state";
import { type FieldValues, type Path } from "react-hook-form";

import { AddressAutocomplete } from "./AddressAutocomplete";
import { type BaseProps } from "./BaseProps";

export const KnownAccountsAutocomplete = <T extends FieldValues, U extends Path<T>>(
  props: BaseProps<T, U>
) => {
  const contacts = useContactsForSelectedNetwork();

  const accounts = useImplicitAccounts().map(account => ({
    name: account.label,
    pkh: account.address.pkh,
  }));

  return <AddressAutocomplete {...props} contacts={contacts.concat(accounts)} />;
};
