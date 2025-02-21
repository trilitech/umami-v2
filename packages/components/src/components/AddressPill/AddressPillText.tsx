import { Text, type TextProps } from "@chakra-ui/react";
import { useGetContactName } from "@umami/state";
import { formatPkh, truncate } from "@umami/tezos";

import { type AddressKind } from "./types";

export const AddressPillText = ({
  addressKind: { pkh, label },
  showPkh,
  alias,
  ...props
}: {
  addressKind: AddressKind;
  showPkh: boolean;
  alias?: string;
} & TextProps) => {
  const getContactName = useGetContactName();
  const formattedPkh = formatPkh(pkh);
  const nameOrLabel = getContactName(pkh) || label || alias;

  if (showPkh) {
    return <Text {...props}>{formattedPkh}</Text>;
  }

  return (
    <Text overflow="hidden" textOverflow="ellipsis" {...props}>
      {nameOrLabel ? truncate(nameOrLabel, 50) : formattedPkh}
    </Text>
  );
};
