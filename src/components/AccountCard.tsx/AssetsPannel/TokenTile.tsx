import { Box, Flex, Heading, Icon, Image, Text } from "@chakra-ui/react";
import { MdGeneratingTokens } from "react-icons/md";
import { FA12Token, FA2Token } from "../../../types/Asset";

const TokenTile = ({ token }: { token: FA12Token | FA2Token }) => {
  const name = token.name();
  const symbol = token.symbol();
  const prettyAmount = token.prettyBalance({ showSymbol: false });
  return (
    <Flex justifyContent={"space-around"} mb={2} data-testid="token-tile">
      <Flex flex={1}>
        {token.iconUri() ? (
          <Image src={token.iconUri()} w={8} h={8} />
        ) : (
          <Icon h={8} w={8} as={MdGeneratingTokens} />
        )}
        <Box ml={4}>
          <Heading data-testid="token-symbol" size={"md"}>
            {symbol}
          </Heading>
          <Text data-testid="token-name" color={"text.dark"} size={"sm"}>
            {name}
          </Text>
        </Box>
      </Flex>
      <Heading data-testid="token-balance" size={"lg"}>
        {prettyAmount}
      </Heading>
    </Flex>
  );
};

export default TokenTile;
