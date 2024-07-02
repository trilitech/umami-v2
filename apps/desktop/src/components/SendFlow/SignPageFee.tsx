import { Flex, Heading, Text } from "@chakra-ui/react";
import { prettyTezAmount } from "@umami/tezos";

import colors from "../../style/colors";

export const SignPageFee: React.FC<{ fee: string | number }> = ({ fee }) => (
  <Flex alignItems="center">
    <Heading marginRight="4px" color={colors.gray[450]} size="sm">
      Fee:
    </Heading>
    <Text color={colors.gray[400]} data-testid="fee" size="sm">
      {prettyTezAmount(fee)}
    </Text>
  </Flex>
);
