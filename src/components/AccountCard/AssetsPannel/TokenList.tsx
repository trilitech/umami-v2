import { Box, Flex, Heading, Icon, Image, Text } from "@chakra-ui/react";
import { MdGeneratingTokens } from "react-icons/md";
import colors from "../../../style/colors";
import {
  FA12TokenBalance,
  FA2TokenBalance,
  httpIconUri,
  tokenName,
  tokenPrettyBalance,
  tokenSymbol,
} from "../../../types/Asset";
import { NoTokens } from "../../NoItems";

const TokenTile = ({ token }: { token: FA12TokenBalance | FA2TokenBalance }) => {
  const name = tokenName(token);
  const symbol = tokenSymbol(token);
  const iconUri = httpIconUri(token);
  const prettyAmount = tokenPrettyBalance(token, { showSymbol: false });
  return (
    <Flex
      justifyContent="space-around"
      alignItems="center"
      mb={2}
      borderBottom={`1px solid ${colors.gray[800]}`}
      h={20}
      data-testid="token-tile"
    >
      <Flex flex={1}>
        {iconUri ? (
          <Image src={iconUri} w={12} h={12} />
        ) : (
          <Icon h={12} w={12} as={MdGeneratingTokens} />
        )}
        <Box ml={4}>
          <Heading data-testid="token-symbol" size="md">
            {symbol}
          </Heading>
          <Text data-testid="token-name" color="text.dark" size="sm">
            {name}
          </Text>
        </Box>
      </Flex>
      <Heading data-testid="token-balance" size="lg">
        {prettyAmount}
      </Heading>
    </Flex>
  );
};

export const TokenList = ({ tokens }: { tokens: Array<FA12TokenBalance | FA2TokenBalance> }) => {
  if (tokens.length === 0) {
    return <NoTokens small />;
  }
  return (
    <Box>
      {tokens.map(t => {
        return <TokenTile token={t} key={t.contract + (t.type === "fa2" ? t.tokenId : "")} />;
      })}
    </Box>
  );
};

export default TokenTile;
