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
  p: "5px",
  bg: colors.gray[500],
};

export const AddressTileIcon: React.FC<{
  addressKind: AddressKind;
  size?: "md" | "lg";
}> = ({ addressKind, size = "md" }) => {
  const sizeInPx = size === "md" ? "30px" : "38.5px";
  switch (addressKind.type) {
    case "secret_key":
    case "mnemonic":
      return (
        <Identicon
          width={sizeInPx}
          height={sizeInPx}
          padding="5px"
          address={addressKind.pkh}
          identiconSize={20}
        />
      );
    case "social":
      return (
        <SocialIcon width={sizeInPx} height={sizeInPx} {...baseIconProps} background="white" />
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
