import { Icon, Image } from "@chakra-ui/react";
import { type AddressKind } from "@umami/components";
import { type ImplicitAccount } from "@umami/core";
import { useGetOwnedAccountSafe } from "@umami/state";
import { memo } from "react";

import { type AddressTileIconSize } from "./AddressTileIconSize";
import { ContactIcon, UnknownIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AccountTileIcon } from "../AccountTile/AccountTileIcon";

/**
 * Displays an icon for an address based on its kind.
 * Can be used with arbitrary addresses, not just accounts.
 * Though for accounts it'll reuse {@link AccountTileIcon}.
 *
 * @param addressKind - The address to display the icon for.
 * @param size - The size of the icon.
 */
export const AddressTileIcon = memo(
  ({ addressKind, size }: { addressKind: AddressKind; size: AddressTileIconSize }) => {
    const getAccount = useGetOwnedAccountSafe();
    const account = getAccount(addressKind.pkh);
    const color = useColor();

    const baseIconProps = {
      borderRadius: "4px",
      color: color("500"),
    };

    if (account) {
      return <AccountTileIcon account={account as ImplicitAccount} />;
    }

    let sizeInPx;
    let padding;
    switch (size) {
      case "sm":
        sizeInPx = "30px";
        padding = "5px";
        break;
      case "lg":
        sizeInPx = "48px";
        padding = "10px";
    }

    switch (addressKind.type) {
      case "contact":
        return (
          <Icon
            as={ContactIcon}
            width={sizeInPx}
            height={sizeInPx}
            padding={padding}
            {...baseIconProps}
          />
        );
      case "unknown":
        return (
          <Icon
            as={UnknownIcon}
            width={sizeInPx}
            height={sizeInPx}
            padding={padding}
            {...baseIconProps}
          />
        );
      case "baker":
        return (
          <Image
            height={sizeInPx}
            data-testid="baker-icon"
            src={`https://services.tzkt.io/v1/avatars/${addressKind.pkh}`}
          />
        );
      case "secret_key":
      case "mnemonic":
      case "social":
      case "ledger":
      case "multisig":
      case "fa1.2":
      case "fa2":
        return null; // impossible state
    }
  }
);
