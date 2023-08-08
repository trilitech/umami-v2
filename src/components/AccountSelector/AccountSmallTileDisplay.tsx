import { Box, Flex, FlexProps, Text } from "@chakra-ui/react";
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
    <Flex {...flexProps} data-testid="account-small-tile">
      <Identicon address={pkh} mr={4} />
      <Box>
        <Text>{label}</Text>
        <Text color="umami.gray.600">{formatPkh(pkh)}</Text>
      </Box>
    </Flex>
  );
};
