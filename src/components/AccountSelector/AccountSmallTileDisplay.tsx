import { Flex, FlexProps, Text } from "@chakra-ui/react";
import colors from "../../style/colors";
import { formatPkh } from "../../utils/formatPkh";
import { Identicon } from "../Identicon";

export const AccountSmallTileDisplay = ({
  pkh,
  label,
  ...flexProps
}: {
  pkh: string;
  label?: string;
} & FlexProps) => {
  return (
    <Flex
      data-testid="account-small-tile"
      {...flexProps}
      alignItems="center"
      pl={4}
      pr={4}
      h={12}
      cursor="pointer"
    >
      <Identicon identiconSize={20} p="5px" address={formatPkh(pkh)} mr={4} />
      <Text size="sm" mx={2}>
        {label}
      </Text>
      <Text size="xs" color="text.dark" mx={2}>
        {formatPkh(pkh)}
      </Text>
    </Flex>
  );
};
