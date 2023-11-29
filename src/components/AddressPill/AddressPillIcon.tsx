import {
  KeyIcon,
  ContactIcon,
  FA12Icon,
  FA2Icon,
  BakerIcon,
  AddContactIcon,
  XMark,
} from "../../assets/icons";
import { AddressKind, AddressKindType } from "./types";
import { IconProps } from "@chakra-ui/react";
import { useContactExists } from "../../utils/hooks/contactsHooks";
import { AddressPillMode } from "./AddressPill";
import { useContext } from "react";
import { DynamicModalContext } from "../DynamicModal";
import { UpsertContactModal } from "../ContactModal";

export const LeftIcon: React.FC<{ addressKind: AddressKind } & IconProps> = ({
  addressKind: { type },
  ...props
}) => {
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

export const RightIcon: React.FC<
  { addressKind: AddressKind; addressPillMode: AddressPillMode } & IconProps
> = ({ addressKind: { type, pkh }, addressPillMode, ...rest }) => {
  const { addressExistsInContacts } = useContactExists();
  const { openWith } = useContext(DynamicModalContext);

  if (addressPillMode.type === "removable") {
    return <XMark cursor="pointer" onClick={addressPillMode.onRemove} {...rest} />;
  }

  const knownTypes: AddressKindType[] = ["implicit", "multisig", "baker"];

  if (knownTypes.includes(type) || addressExistsInContacts(pkh)) {
    return null;
  }

  return (
    <>
      <AddContactIcon
        data-testid="add-contact-icon"
        onClick={() => {
          openWith(
            <UpsertContactModal
              buttonText="Add to Contact"
              contact={{ name: "", pkh }}
              title="Add contact"
            />
          );
        }}
        {...rest}
      />
    </>
  );
};
