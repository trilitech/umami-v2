import { Image } from "@chakra-ui/react";
import { memo } from "react";

import { AddressTileIconSize } from "./AddressTileIconSize";
import { AddressKind } from "./types";
import { ContactIcon, UnknownContactIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { useGetOwnedAccountSafe } from "../../utils/hooks/getAccountDataHooks";
import { AccountTileIcon } from "../AccountTile/AccountTileIcon";

const baseIconProps = {
  stroke: colors.gray[400],
  borderRadius: "4px",
  background: colors.gray[500],
};

/**
 * Displays an icon for an address based on its kind.
 * Can be used with arbitrary addresses, not just accounts.
 * Though for accounts it'll reuse {@link AccountTileIcon}.
 *
 * @param addressKind - The address to display the icon for.
 * @param size - The size of the icon.
 */
export const AddressTileIcon: React.FC<{
  addressKind: AddressKind;
  size: AddressTileIconSize;
}> = memo(({ addressKind, size }) => {
  const getAccount = useGetOwnedAccountSafe();
  const account = getAccount(addressKind.pkh);

  if (account) {
    return <AccountTileIcon account={account} size={size} />;
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
        <ContactIcon width={sizeInPx} height={sizeInPx} padding={padding} {...baseIconProps} />
      );
    case "unknown":
      return (
        <UnknownContactIcon
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
      return null; // impossible state
  }
});
