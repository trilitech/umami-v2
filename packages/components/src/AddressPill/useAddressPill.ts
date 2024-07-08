import { useDisclosure, useOutsideClick } from "@chakra-ui/react";
import { type Address, parsePkh } from "@umami/tezos";
import { type TzktAlias } from "@umami/tzkt";
import { useCallback, useRef, useState } from "react";

import { type AddressPillMode } from "./types";
import { useAddressKind } from "./useAddressKind";

export const useAddressPill = ({
  rawAddress,
  mode = "default",
}: {
  rawAddress: Address | TzktAlias;
  mode?: AddressPillMode;
}) => {
  let address: Address;
  let addressAlias: string | undefined;

  if ("pkh" in rawAddress && "type" in rawAddress) {
    address = rawAddress;
    addressAlias = undefined;
  } else {
    address = parsePkh(rawAddress.address);
    addressAlias = rawAddress.alias || undefined;
  }

  const addressKind = useAddressKind(address);
  const showIcons = mode !== "no_icons";
  const [isMouseHover, setIsMouseHover] = useState(false);
  const { onOpen, onClose: closePopover, isOpen: isPopoverOpen } = useDisclosure();

  const onClick = useCallback(async () => {
    await navigator.clipboard.writeText(address.pkh);
    onOpen();
    setTimeout(closePopover, 1000);
  }, [onOpen, address.pkh, closePopover]);

  // Needed to handle styling after contact modal opens
  const elementRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: elementRef,
    handler: () => setIsMouseHover(false),
  });

  return {
    addressKind,
    addressAlias,
    address,

    isMouseHover,
    setIsMouseHover,

    isPopoverOpen,
    closePopover,

    elementRef,
    showIcons,
    onClick,
  };
};
