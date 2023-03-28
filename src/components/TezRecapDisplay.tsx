import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

export const TezRecapDisplay: React.FC<{
  tezBalance: number;
  dollarBalance: number | null;
  center?: boolean;
}> = (props) => {
  return (
    <Box textAlign={props.center ? "center" : "initial"}>
      <Heading size={"md"}>{`${props.tezBalance} ꜩ`}</Heading>
      {props.dollarBalance !== null && (
        <Text size={"sm"} color="umami.gray.400">
          ${props.dollarBalance.toFixed(2)}
        </Text>
      )}
    </Box>
  );
};
