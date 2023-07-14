import KeyIcon from "../../assets/icons/Key";
import ContactIcon from "../../assets/icons/Contact";
import FA12Icon from "../../assets/icons/FA1.2";
import FA2Icon from "../../assets/icons/FA2";
import BakerIcon from "../../assets/icons/Baker";
import { AddressKind, AddressKindType } from "./types";
import { IconProps } from "@chakra-ui/react";
import { useContactExists } from "../../utils/hooks/contactsHooks";
import AddContactIcon from "../../assets/icons/AddContact";
import { useUpsertContactModal } from "../../views/home/useUpsertContactModal";
import XMark from "../../assets/icons/XMark";

export const LeftIcon: React.FC<{ addressKind: AddressKind } & IconProps> = ({
  addressKind: { type },
  ...rest
}) => {
  switch (type) {
    case "ownedMultisig":
      return <KeyIcon data-testid={`${type}-icon`} {...rest} />;
    case "fa1.2":
      return <FA12Icon data-testid={`${type}-icon`} {...rest} />;
    case "fa2":
      return <FA2Icon data-testid={`${type}-icon`} {...rest} />;
    case "baker":
      return <BakerIcon data-testid={`${type}-icon`} {...rest} />;
    case "contact":
      return <ContactIcon data-testid={`${type}-icon`} {...rest} />;
    case "unknown":
    case "ownedImplicit":
      return null;
  }
};

export const RightIcon: React.FC<{ addressKind: AddressKind; isRemove: boolean } & IconProps> = ({
  addressKind: { type, pkh },
  isRemove,
  ...rest
}) => {
  const { addressExistsInContacts } = useContactExists();
  const { modalElement, onOpen } = useUpsertContactModal();

  if (isRemove) {
    return <XMark data-testid="x-mark-icon" {...rest} />;
  }

  const knownTypes: AddressKindType[] = ["ownedImplicit", "ownedMultisig", "baker"];

  if (knownTypes.includes(type) || addressExistsInContacts(pkh)) {
    return null;
  }

  return (
    <>
      <AddContactIcon
        data-testid="add-contact-icon"
        onClick={() => {
          onOpen({
            title: "Add Contact",
            buttonText: "Add to Contact",
            contact: { name: "", pkh },
          });
        }}
        {...rest}
      />
      {modalElement}
    </>
  );
};
