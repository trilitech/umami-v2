import { Box, Flex, Heading } from "@chakra-ui/react";

import { ViewAllLink } from "./ViewAllLink";
import { TokenIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { RawPkh } from "../../../types/Address";
import { fullId, tokenPrettyAmount } from "../../../types/Token";
import { FA12TokenBalance, FA2TokenBalance } from "../../../types/TokenBalance";
import { TokenNameWithIcon } from "../../../views/tokens/TokenNameWithIcon";
import { NoItems } from "../../NoItems";

const MAX_TOKENS_SIZE = 20;

/**
 * List of {@link TokenTile} to be displayed in the account drawer.
 *
 * Limits the number of displayed tokens to {@link MAX_TOKENS_SIZE}.
 *
 * @param owner - Address of the account for which the drawer was opened.
 * @param tokens - List of owner's tokens.
 */
export const TokenList = ({
  owner,
  tokens,
}: {
  owner: RawPkh;
  tokens: Array<FA12TokenBalance | FA2TokenBalance>;
}) => {
  if (tokens.length === 0) {
    return <NoItems small title="No tokens found" />;
  }

  const chunk = tokens.slice(0, MAX_TOKENS_SIZE);

  return (
    <Box>
      {chunk.map(token => (
        <TokenTile key={fullId(token)} token={token} />
      ))}
      {tokens.length > MAX_TOKENS_SIZE && <ViewAllLink to={`/tokens?accounts=${owner}`} />}
    </Box>
  );
};

/**
 * Token tile to be displayed in the account drawer.
 *
 * Contains icon, token name with verification icon & balance.
 *
 * @param token - Token to be displayed.
 */
const TokenTile = ({ token }: { token: FA12TokenBalance | FA2TokenBalance }) => {
  const prettyAmount = tokenPrettyAmount(token.balance, token, { showSymbol: false });
  return (
    <Flex
      alignItems="center"
      justifyContent="space-around"
      height={20}
      borderBottom={`1px solid ${colors.gray[800]}`}
      data-testid="token-tile"
    >
      <Flex alignItems="center" flex={1}>
        <TokenIcon
          width="38px"
          background={colors.gray[500]}
          borderRadius="4px"
          contract={token.contract}
        />
        <Box marginLeft="16px">
          <TokenNameWithIcon fontWeight={600} data-testid="token-name" token={token} />
        </Box>
      </Flex>
      <Heading data-testid="token-balance" size="lg">
        {prettyAmount}
      </Heading>
    </Flex>
  );
};
