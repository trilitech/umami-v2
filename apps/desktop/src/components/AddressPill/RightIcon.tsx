import { type IconProps } from "@chakra-ui/react";
import { type AddressKind, KNOWN_ADDRESS_TYPES, useDynamicModalContext } from "@umami/components";
import { useAddressExistsInContacts } from "@umami/state";
import { memo } from "react";

import { AddContactIcon, XMarkIcon } from "../../assets/icons";
import { UpsertContactModal } from "../UpsertContactModal";

export const RightIcon = memo(
  ({
    addressKind: { type, pkh },
    onRemove,
    ...rest
  }: { addressKind: AddressKind; onRemove?: () => void } & IconProps) => {
    const addressExistsInContacts = useAddressExistsInContacts();
    const { openWith } = useDynamicModalContext();

    if (onRemove) {
      return <XMarkIcon cursor="pointer" onClick={onRemove} {...rest} />;
    }

    if (KNOWN_ADDRESS_TYPES.includes(type) || addressExistsInContacts(pkh)) {
      return null;
    }

    return (
      <AddContactIcon
        data-testid="add-contact-icon"
        onClick={() => openWith(<UpsertContactModal contact={{ name: "", pkh }} />)}
        {...rest}
      />
    );
  }
);
