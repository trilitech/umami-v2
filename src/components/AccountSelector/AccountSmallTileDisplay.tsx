import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { formatPkh } from "../../utils/formatPkh";
import { Identicon } from "../Identicon";
import { prettyTezAmount } from "../../utils/format";

export const AccountSmallTileDisplay = ({
  pkh,
  label,
  balance,
  ...flexProps
}: {
  pkh: string;
  label?: string;
  balance: string | undefined;
} & FlexProps) => (
  <Flex
    data-testid="account-small-tile"
    alignItems="space-between"
    pl={4}
    pr={4}
    h="24px"
    cursor="pointer"
    {...flexProps}
  >
    <Identicon identiconSize={20} p="5px" address={formatPkh(pkh)} mr={4} />
    <Text size="sm" mx={2}>
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
