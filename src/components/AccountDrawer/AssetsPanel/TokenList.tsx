import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import colors from "../../../style/colors";
import { FA12TokenBalance, FA2TokenBalance } from "../../../types/TokenBalance";
import { tokenNameSafe, tokenPrettyAmount, tokenSymbolSafe } from "../../../types/Token";
import NoItems from "../../NoItems";
import TokenIcon from "../../../assets/icons/Token";

const TokenTile = ({ token }: { token: FA12TokenBalance | FA2TokenBalance }) => {
  const name = tokenNameSafe(token);
  const prettyAmount = tokenPrettyAmount(token.balance, token, { showSymbol: false });
  return (
    <Flex
      justifyContent="space-around"
      alignItems="center"
      borderBottom={`1px solid ${colors.gray[800]}`}
      h={20}
      data-testid="token-tile"
    >
      <Flex flex={1} alignItems="center">
        <TokenIcon w="38px" contract={token.contract} bg={colors.gray[500]} borderRadius="4px" />
        <Box ml="16px">
          <Text data-testid="token-name" fontWeight={600}>
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
    return <NoItems text="No Tokens found" small />;
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
