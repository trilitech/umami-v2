import { useGetBaker, useGetContactName, useGetOwnedAccountSafe } from "@umami/state";
import { type Address } from "@umami/tezos";

import {
  type AddressKind,
  type BakerAddress,
  type ContactAddress,
  type OwnedAddress,
} from "./types";

export const useAddressKind = (address: Address): AddressKind => {
  const ownedAccount = useOwnedAccountAddressKind(address);

  const baker = useBakerAddressKind(address);

  const contact = useContactAddressKind(address);

  const known = ownedAccount || baker || contact;

  return known || { pkh: address.pkh, type: "unknown", label: null };
};

export const useOwnedAccountAddressKind = ({ pkh }: Address): OwnedAddress | null => {
  const getOwnedAccount = useGetOwnedAccountSafe();
  const account = getOwnedAccount(pkh);
  if (!account) {
    return null;
  }

  return {
    type: account.type,
    pkh,
    label: account.label,
  };
};

export const useBakerAddressKind = ({ pkh }: Address): BakerAddress | null => {
  const getBaker = useGetBaker();
  const baker = getBaker(pkh);
  if (!baker) {
    return null;
  }
  return {
    pkh,
    type: "baker",
    label: baker.name,
  };
};

export const useContactAddressKind = ({ pkh }: Address): ContactAddress | null => {
  const getContactName = useGetContactName();
  const contactName = getContactName(pkh);
  if (!contactName) {
    return null;
  }
  return {
    pkh,
    type: "contact",
    label: contactName,
  };
};
