import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { AddressKind } from "../AccountTile/AddressKind";
import { AddressIcon } from "../AccountTile/AddressIcon";
import { formatPkh } from "../../utils/formatPkh";
import { prettyTezAmount } from "../../utils/format";

export const AccountSmallTileDisplay = ({
  pkh,
  label,
  kind,
  balance,
  ...flexProps
}: {
  pkh: string;
  label?: string;
  kind: AddressKind;
  balance: string | undefined;
} & FlexProps) => {
  return (
    <Flex data-testid="account-small-tile" {...flexProps} alignItems="center" cursor="pointer">
      <AddressIcon kind={kind} address={pkh} iconSize="20px" padding="5px" />
      <Text size="sm" mx={2} fontWeight={600}>
        {label}
      </Text>

      <Text size="xs" color="text.dark" mx={2}>
        {formatPkh(pkh)}
      </Text>

      {balance && (
        <Text size="sm" color="white" fontWeight={600}>
          {prettyTezAmount(balance)}
        </Text>
      )}
    </Flex>
  );
};
