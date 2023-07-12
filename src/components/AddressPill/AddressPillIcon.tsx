import KeyIcon from "../../assets/icons/Key";
import ContactIcon from "../../assets/icons/Contact";
import FA12Icon from "../../assets/icons/FA1.2";
import FA2Icon from "../../assets/icons/FA2";
import BakerIcon from "../../assets/icons/Baker";
import { AddressKind } from "./types";
import { IconProps } from "@chakra-ui/react";
import { useContactExists } from "../../utils/hooks/contactsHooks";
import AddContactIcon from "../../assets/icons/AddContact";
import { useUpsertContactModal } from "../../views/home/useUpsertContactModal";
import XMark from "../../assets/icons/XMark";

export const LeftIcon: React.FC<{ addressKind: AddressKind } & IconProps> = ({
  addressKind: { type, pkh },
  ...rest
}) => {
  const { addressExistsInContacts } = useContactExists();
  const addressExists = addressExistsInContacts(pkh);
  switch (type) {
    case "multisig":
      return <KeyIcon {...rest} />;
    case "implicit":
      return addressExists ? <ContactIcon {...rest} /> : null;
    case "fa1.2":
      return <FA12Icon {...rest} />;
    case "fa2":
      return <FA2Icon {...rest} />;
    case "baker":
      return <BakerIcon {...rest} />;
    default:
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
    return <XMark {...rest} />;
  }

  const knownType = ["implicit", "multisig", "baker", "contact"].includes(type);
  const isInContacts = addressExistsInContacts(pkh);

  if (knownType || isInContacts) {
    return null;
  }

  return (
    <>
      <AddContactIcon
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
