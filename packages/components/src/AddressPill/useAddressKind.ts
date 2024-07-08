import {
  useGetBaker,
  useGetContactName,
  useGetOwnedAccountSafe,
  useGetTokenType,
  useSelectedNetwork,
} from "@umami/state";
import { type Address } from "@umami/tezos";

import {
  type AddressKind,
  type BakerAddress,
  type ContactAddress,
  type FA12Address,
  type FA2Address,
  type OwnedAddress,
} from "./types";

export const useAddressKind = (address: Address): AddressKind => {
  const ownedAccount = useOwnedAccountAddressKind(address);

  const token = useTokenAddressKind(address);

  const baker = useBakerAddressKind(address);

  const contact = useContactAddressKind(address);

  const known = ownedAccount || token || baker || contact;

  return known || { pkh: address.pkh, type: "unknown", label: null };
};

const useBakerAddressKind = ({ pkh }: Address): BakerAddress | null => {
  const getBaker = useGetBaker();
  const baker = getBaker(pkh);

  return baker
    ? {
        pkh,
        type: "baker",
        label: baker.name,
      }
    : null;
};

const useOwnedAccountAddressKind = ({ pkh }: Address): OwnedAddress | null => {
  const getOwnedAccount = useGetOwnedAccountSafe();
  const account = getOwnedAccount(pkh);

  return account
    ? {
        type: account.type,
        pkh,
        label: account.label,
      }
    : null;
};

const useTokenAddressKind = ({ pkh }: Address): FA12Address | FA2Address | null => {
  const network = useSelectedNetwork();
  const getTokenType = useGetTokenType(network);
  const tokenType = getTokenType(pkh);

  if (!tokenType) {
    return null;
  }

  switch (tokenType) {
    case "fa1.2":
      return {
        pkh,
        type: "fa1.2",
        label: null,
      };
    case "fa2":
    case "nft":
      return {
        pkh,
        type: "fa2",
        label: null,
      };
  }
};

const useContactAddressKind = ({ pkh }: Address): ContactAddress | null => {
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
