import { Box, Heading, Text } from "@chakra-ui/react";
import { prettyTezAmount } from "@umami/tezos";
import type { BigNumber } from "bignumber.js";

import colors from "../style/colors";

export const TezRecapDisplay = (props: {
  balance: BigNumber | number | string;
  dollarBalance: BigNumber | undefined;
  center?: boolean;
}) => (
  <Box textAlign={props.center ? "center" : "initial"}>
    <Heading size="md">{prettyTezAmount(props.balance)}</Heading>
    {props.dollarBalance !== undefined && (
      <Text marginTop="6px" color={colors.gray[400]} size="sm">
        ${props.dollarBalance.toFixed(2)}
      </Text>
    )}
  </Box>
);
