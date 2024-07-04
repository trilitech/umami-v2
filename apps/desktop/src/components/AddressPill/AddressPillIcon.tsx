import { type IconProps } from "@chakra-ui/react";
import { DynamicModalContext } from "@umami/components";
import { useAddressExistsInContacts } from "@umami/state";
import { useContext } from "react";

import { type AddressPillMode } from "./AddressPillMode";
import { type AddressKind } from "./types";
import {
  AddContactIcon,
  BakerIcon,
  ContactIcon,
  FA12Icon,
  FA2Icon,
  KeyIcon,
  XMarkIcon,
} from "../../assets/icons";
import { UpsertContactModal } from "../UpsertContactModal";

export const LeftIcon = ({
  addressKind: { type },
  ...props
}: { addressKind: AddressKind } & IconProps) => {
  switch (type) {
    case "multisig":
      return <KeyIcon data-testid={`${type}-icon`} {...props} />;
    case "fa1.2":
      return <FA12Icon data-testid={`${type}-icon`} {...props} fill={props.stroke} stroke="none" />;
    case "fa2":
      return <FA2Icon data-testid={`${type}-icon`} {...props} fill={props.stroke} stroke="none" />;
    case "baker":
      return <BakerIcon data-testid={`${type}-icon`} {...props} />;
    case "contact":
      return <ContactIcon data-testid={`${type}-icon`} {...props} />;
    case "unknown":
    case "implicit":
      return null;
  }
};

export const RightIcon = ({
  addressKind: { type, pkh },
  addressPillMode,
  ...rest
}: { addressKind: AddressKind; addressPillMode: AddressPillMode } & IconProps) => {
  const addressExistsInContacts = useAddressExistsInContacts();
  const { openWith } = useContext(DynamicModalContext);

  if (addressPillMode.type === "removable") {
    return <XMarkIcon cursor="pointer" onClick={addressPillMode.onRemove} {...rest} />;
  }

  const knownTypes: AddressKind["type"][] = ["implicit", "multisig", "baker"];

  if (knownTypes.includes(type) || addressExistsInContacts(pkh)) {
    return null;
  }

  return (
    <>
      <AddContactIcon
        data-testid="add-contact-icon"
        onClick={() => openWith(<UpsertContactModal contact={{ name: "", pkh }} />)}
        {...rest}
      />
    </>
  );
};
