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

const Wrapper = chakra(Flex, {
  baseStyle: {
    borderRadius: "4px",
    p: "8px",
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

export const getIcon = (kind: AddressKind, address?: string) => {
  switch (kind) {
    case "contact": {
      return (
        <Wrapper>
          <ContactIcon {...iconProps} />
        </Wrapper>
      );
    }
    case "unknown": {
      return (
        <Wrapper>
          <UnknownContactIcon {...iconProps} />
        </Wrapper>
      );
    }
    case AccountType.SOCIAL: {
      return (
        <Wrapper backgroundColor={colors.white}>
          <SocialIcon />
        </Wrapper>
      );
    }
    case AccountType.MULTISIG: {
      return (
        <Wrapper>
          <KeyIcon {...iconProps} />
        </Wrapper>
      );
    }
    case AccountType.LEDGER: {
      return (
        <Wrapper>
          <LedgerIcon {...iconProps} color={colors.gray[400]} />
        </Wrapper>
      );
    }
    case AccountType.MNEMONIC: {
      if (!address) {
        throw new Error("Address is required for mnemonic account");
      }
      return <Identicon address={address} />;
    }
  }
};
