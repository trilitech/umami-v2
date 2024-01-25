import { AspectRatio, Image } from "@chakra-ui/react";

import { AddressKind } from "./types";
import {
  ContactIcon,
  KeyIcon,
  LedgerIcon,
  SocialIcon,
  UnknownContactIcon,
} from "../../assets/icons";
import colors from "../../style/colors";
import { Identicon } from "../Identicon";

const baseIconProps = {
  stroke: colors.gray[400],
  borderRadius: "4px",
  padding: "5px",
  background: colors.gray[500],
};

type AddressTileIconSize = "sm" | "md" | "lg";

export const AddressTileIcon: React.FC<{
  addressKind: AddressKind;
  size?: AddressTileIconSize;
  identiconSize?: number; // only used for secret_key and mnemonic
}> = ({ addressKind, size = "sm", identiconSize = 20 }) => {
  let sizeInPx;
  switch (size) {
    case "sm":
      sizeInPx = "30px";
      break;
    case "md":
      sizeInPx = "38.5px";
      break;
    case "lg":
      sizeInPx = "45.5px";
      break;
  }

  switch (addressKind.type) {
    case "secret_key":
    case "mnemonic":
      return (
        <Identicon
          width={sizeInPx}
          height={sizeInPx}
          padding="5px"
          address={addressKind.pkh}
          identiconSize={identiconSize}
        />
      );
    case "social":
      return (
        <SocialIcon
          width={sizeInPx}
          height={sizeInPx}
          {...baseIconProps}
          stroke="transparent"
          background="white"
        />
      );
    case "ledger":
      return (
        <LedgerIcon
          width={sizeInPx}
          height={sizeInPx}
          {...baseIconProps}
          color={colors.gray[400]}
        />
      );
    case "multisig":
      return <KeyIcon width={sizeInPx} height={sizeInPx} {...baseIconProps} />;
    case "contact":
      return <ContactIcon width={sizeInPx} height={sizeInPx} {...baseIconProps} />;
    case "unknown":
      return <UnknownContactIcon width={sizeInPx} height={sizeInPx} {...baseIconProps} />;
    case "baker": {
      const bakerLogoUrl = `https://services.tzkt.io/v1/avatars/${addressKind.pkh}`;
      return (
        <AspectRatio
          width="30px"
          height="30px"
          marginRight="8px"
          data-testid="baker-icon"
          ratio={1}
        >
          <Image src={bakerLogoUrl} />
        </AspectRatio>
      );
    }
  }
};
