import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { MdGeneratingTokens } from "react-icons/md";
import {
  FA12Token,
  FA2Token,
  getTokenName,
  getTokenPrettyAmmount,
  getTokenSymbol,
} from "../../../types/Asset";

const TokenTile = ({ token }: { token: FA12Token | FA2Token }) => {
  const name = getTokenName(token);
  const symbol = getTokenSymbol(token);
  const prettyAmount = getTokenPrettyAmmount(token, { showSymbol: false });
  return (
    <Flex justifyContent={"space-around"} mb={2} data-testid="token-tile">
      <Flex flex={1}>
        <Icon h={8} w={8} as={MdGeneratingTokens} />
        <Box ml={4}>
          <Heading size={"md"}>{symbol}</Heading>
          <Text color={"text.dark"} size={"sm"}>
            {name}
          </Text>
        </Box>
      </Flex>
      <Heading size={"lg"}>{prettyAmount}</Heading>
    </Flex>
  );
};

export default TokenTile;
