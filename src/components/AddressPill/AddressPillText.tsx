import { useGetContactName } from "../../utils/hooks/contactsHooks";
import { formatPkh, truncate } from "../../utils/format";
import { Text, TextProps } from "@chakra-ui/react";
import { AddressKind } from "./types";

const AddressPillText: React.FC<
  {
    addressKind: AddressKind;
  } & TextProps
> = ({ addressKind: { pkh, label }, ...rest }) => {
  const getContactName = useGetContactName();
  const name = getContactName(pkh) || label;
  const text = name ? truncate(name, 20) : formatPkh(pkh);

  return <Text {...rest}>{text}</Text>;
};

export default AddressPillText;
