import { useGetContactName } from "../../utils/hooks/contactsHooks";
import { formatPkh, truncate } from "../../utils/format";
import { Text, TextProps } from "@chakra-ui/react";
import { AddressKind } from "./types";

const AddressPillText: React.FC<
  {
    addressKind: AddressKind;
    showPkh: boolean;
    alias?: string;
  } & TextProps
> = ({ addressKind: { pkh, label }, showPkh, alias, ...rest }) => {
  const getContactName = useGetContactName();
  const formattedPkh = formatPkh(pkh);
  const nameOrLabel = getContactName(pkh) || label || alias;

  if (showPkh) {
    return <Text {...rest}>{formattedPkh}</Text>;
  }

  return <Text {...rest}>{nameOrLabel ? truncate(nameOrLabel, 21) : formattedPkh}</Text>;
};

export default AddressPillText;
