import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import type { BigNumber } from "bignumber.js";
import { prettyTezAmount } from "../utils/format";

export const TezRecapDisplay: React.FC<{
  balance: string;
  dollarBalance: BigNumber | null;
  center?: boolean;
}> = props => {
  return (
    <Box textAlign={props.center ? "center" : "initial"}>
      <Heading size="md">{prettyTezAmount(props.balance)}</Heading>
      {props.dollarBalance !== null && (
        <Text size="sm" color="umami.gray.400">
          ${props.dollarBalance.toFixed(2)}
        </Text>
      )}
    </Box>
  );
};
