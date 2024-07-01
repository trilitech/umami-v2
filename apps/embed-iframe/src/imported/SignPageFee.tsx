import { Flex, Heading, Text } from "@chakra-ui/react";

import colors from "./style/colors";
import { prettyTezAmount } from "../utils";

export const SignPageFee: React.FC<{ fee: string | number }> = ({ fee }) => (
  <Flex alignItems="center">
    <Heading marginRight="4px" color={colors.grey[450]} size="sm">
      Fee:
    </Heading>
    <Text color={colors.grey[400]} data-testid="fee" size="sm">
      {prettyTezAmount(fee)}
    </Text>
  </Flex>
);
