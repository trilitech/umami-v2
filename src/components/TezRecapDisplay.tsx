import { Box, Heading, Text } from "@chakra-ui/react";
import type { BigNumber } from "bignumber.js";
import React from "react";

import colors from "../style/colors";
import { prettyTezAmount } from "../utils/format";

export const TezRecapDisplay: React.FC<{
  balance: string;
  dollarBalance: BigNumber | null;
  center?: boolean;
}> = props => (
  <Box textAlign={props.center ? "center" : "initial"}>
    <Heading size="md">{prettyTezAmount(props.balance)}</Heading>
    {props.dollarBalance !== null && (
      <Text marginTop="6px" color={colors.gray[400]} size="sm">
        ${props.dollarBalance.toFixed(2)}
      </Text>
    )}
  </Box>
);
