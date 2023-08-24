import { Flex, chakra } from "@chakra-ui/react";
import ContactIcon from "../../assets/icons/Contact";
import UnknownContactIcon from "../../assets/icons/UnknownContact";
import KeyIcon from "../../assets/icons/Key";
import LedgerIcon from "../../assets/icons/Ledger";
import SocialIcon from "../../assets/icons/Social";
import colors from "../../style/colors";
import { AccountType } from "../../types/Account";
import { Identicon } from "../Identicon";
import { AddressKind } from "./AddressKind";
import BakerIcon from "../../assets/icons/Baker";

export const AddressIcon: React.FC<{
  kind: AddressKind;
  address?: string;
  iconSize?: string;
  padding?: string;
}> = ({ kind, address, iconSize = "28px", padding = "8px" }) => {
  const Wrapper = chakra(Flex, {
    baseStyle: {
      borderRadius: "4px",
      p: padding,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.gray[500],
    },
  });

  const iconProps = {
    stroke: colors.gray[400],
    height: "28px",
    width: "28px",
  };

  const props = { ...iconProps, width: iconSize, height: iconSize };
  switch (kind) {
    case "contact": {
      return (
        <Wrapper>
          <ContactIcon {...props} />
        </Wrapper>
      );
    }
    case "unknown": {
      return (
        <Wrapper>
          <UnknownContactIcon {...props} />
        </Wrapper>
      );
    }
    case "baker": {
      return (
        <Wrapper>
          <BakerIcon {...props} />
        </Wrapper>
      );
    }
    case AccountType.SOCIAL: {
      return (
        <Wrapper backgroundColor={colors.white}>
          <SocialIcon w={iconSize} h={iconSize} />
        </Wrapper>
      );
    }
    case AccountType.MULTISIG: {
      return (
        <Wrapper>
          <KeyIcon {...props} />
        </Wrapper>
      );
    }
    case AccountType.LEDGER: {
      return (
        <Wrapper>
          <LedgerIcon {...props} color={colors.gray[400]} />
        </Wrapper>
      );
    }
    case AccountType.MNEMONIC: {
      if (!address) {
        throw new Error("Address is required for mnemonic account icon");
      }
      return <Identicon padding={padding} identiconSize={parseInt(iconSize)} address={address} />;
    }
  }
};
