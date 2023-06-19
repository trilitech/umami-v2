import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import type { BigNumber } from "bignumber.js";

export const TezRecapDisplay: React.FC<{
  tezBalance: string;
  dollarBalance: BigNumber | null;
  center?: boolean;
}> = props => {
  return (
    <Box textAlign={props.center ? "center" : "initial"}>
      <Heading size="md">{`${props.tezBalance} ꜩ`}</Heading>
      {props.dollarBalance !== null && (
        <Text size="sm" color="umami.gray.400">
          ${props.dollarBalance.toFixed(2)}
        </Text>
      )}
    </Box>
  );
};
