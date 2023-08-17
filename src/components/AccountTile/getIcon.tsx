import { Flex, chakra } from "@chakra-ui/react";
import ContactIcon from "../../assets/icons/Contact";
import UnknownContactIcon from "../../assets/icons/UnknownContactIcon";
import KeyIcon from "../../assets/icons/Key";
import LedgerIcon from "../../assets/icons/Ledger";
import SocialIcon from "../../assets/icons/Social";
import colors from "../../style/colors";
import { AccountType } from "../../types/Account";
import { Identicon } from "../Identicon";

const Wrapper = chakra(Flex, {
  borderRadius: "4px",
  p: "8px",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "umami.gray.500",
});

export const getIcon = (kind?: AccountType | "contact" | "unknownContact", address?: string) => {
  if (kind === "contact") {
    return (
      <Wrapper>
        <ContactIcon stroke={colors.gray[400]} height="28px" width="28px" />
      </Wrapper>
    );
  }

  if (kind === "unknownContact") {
    return (
      <Wrapper>
        <UnknownContactIcon stroke={colors.gray[400]} height="28px" width="28px" />
      </Wrapper>
    );
  }

  if (kind === AccountType.SOCIAL) {
    return (
      <Wrapper backgroundColor="umami.white">
        <SocialIcon />
      </Wrapper>
    );
  }

  if (kind === AccountType.MULTISIG) {
    return (
      <Wrapper>
        <KeyIcon stroke={colors.gray[400]} height="28px" width="28px" />
      </Wrapper>
    );
  }

  if (kind === AccountType.LEDGER) {
    return (
      <Wrapper>
        <LedgerIcon stroke={colors.gray[400]} height="28px" width="28px" />
      </Wrapper>
    );
  }

  if (kind === AccountType.MNEMONIC && address !== undefined) {
    return <Identicon address={address} />;
  }

  return null;
};
