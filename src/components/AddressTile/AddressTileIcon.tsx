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
  height: "30px",
  width: "30px",
  borderRadius: "4px",
  p: "5px",
  bg: colors.gray[500],
};

const AddressTileIcon: React.FC<{
  addressKind: AddressKind;
}> = ({ addressKind }) => {
  switch (addressKind.type) {
    case "mnemonic":
      return <Identicon p="5px" identiconSize={20} address={addressKind.pkh} />;
    case "social":
      return <SocialIcon {...baseIconProps} bg="white" />;
    case "ledger":
      return <LedgerIcon {...baseIconProps} color={colors.gray[400]} />;
    case "multisig":
      return <KeyIcon {...baseIconProps} />;
    case "contact":
      return <ContactIcon {...baseIconProps} />;
    case "unknown":
      return <UnknownContactIcon {...baseIconProps} />;
    case "baker":
      return <BakerIcon {...baseIconProps} />;
  }
};

export default AddressTileIcon;
