import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

export const TezRecapDisplay: React.FC<{
  tezBalance: number;
  dollarBalance: number;
  center?: boolean;
}> = (props) => {
  return (
    <Box textAlign={props.center ? "center" : "initial"}>
      <Heading size={"md"}>{`${props.tezBalance} ꜩ`}</Heading>
      <Text size={"sm"} color="text.dark">
        ${props.dollarBalance}
      </Text>
    </Box>
  );
};
