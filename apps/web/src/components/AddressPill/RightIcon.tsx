import { Icon, type IconProps, ModalContent } from "@chakra-ui/react";
import { type AddressKind, KNOWN_ADDRESS_TYPES, useDynamicModalContext } from "@umami/components";
import { useAddressExistsInContacts } from "@umami/state";
import { memo } from "react";

import { AddContactIcon } from "../../assets/icons";

export const RightIcon = memo(
  ({ addressKind: { type, pkh }, ...rest }: { addressKind: AddressKind } & IconProps) => {
    const addressExistsInContacts = useAddressExistsInContacts();
    const { openWith } = useDynamicModalContext();

    if (KNOWN_ADDRESS_TYPES.includes(type) || addressExistsInContacts(pkh)) {
      return null;
    }

    return (
      <Icon
        as={AddContactIcon}
        data-testid="add-contact-icon"
        onClick={() => openWith(<ModalContent>NOT IMPLEMENTED</ModalContent>)} // TODO: add
        {...rest}
      />
    );
  }
);
