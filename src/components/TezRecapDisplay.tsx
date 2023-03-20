import React from "react";
import { Box, Text } from "@chakra-ui/react";

export const TezRecapDisplay: React.FC<{
  tezBalance: number;
  dollarBalance: number;
  center?: boolean;
}> = (props) => {
  return (
    <Box textAlign={props.center ? "center" : "initial"}>
      <Text fontSize={"lg"}>{`${props.tezBalance} ꜩ`}</Text>
      <Text fontSize={"sm"} color="umami.gray.400">
        ${props.dollarBalance}
      </Text>
    </Box>
  );
};
