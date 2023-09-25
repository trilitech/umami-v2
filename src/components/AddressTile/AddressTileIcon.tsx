import ContactIcon from "../../assets/icons/Contact";
import UnknownContactIcon from "../../assets/icons/UnknownContact";
import SocialIcon from "../../assets/icons/Social";
import colors from "../../style/colors";
import KeyIcon from "../../assets/icons/Key";
import LedgerIcon from "../../assets/icons/Ledger";
import BakerIcon from "../../assets/icons/Baker";
import { Identicon } from "../Identicon";
import { AddressKind } from "./types";

const baseIconProps = {
  stroke: colors.gray[400],
  borderRadius: "4px",
  p: "5px",
  bg: colors.gray[500],
};

const AddressTileIcon: React.FC<{
  addressKind: AddressKind;
  size?: "md" | "lg";
}> = ({ addressKind, size = "md" }) => {
  const w = size === "md" ? "30px" : "38.5px";
  switch (addressKind.type) {
    case "mnemonic":
      return <Identicon p="5px" w={w} h={w} identiconSize={20} address={addressKind.pkh} />;
    case "social":
      return <SocialIcon w={w} h={w} {...baseIconProps} bg="white" />;
    case "ledger":
      return <LedgerIcon w={w} h={w} {...baseIconProps} color={colors.gray[400]} />;
    case "multisig":
      return <KeyIcon w={w} h={w} {...baseIconProps} />;
    case "contact":
      return <ContactIcon w={w} h={w} {...baseIconProps} />;
    case "unknown":
      return <UnknownContactIcon w={w} h={w} {...baseIconProps} />;
    case "baker":
      return <BakerIcon w={w} h={w} {...baseIconProps} />;
  }
};

export default AddressTileIcon;
