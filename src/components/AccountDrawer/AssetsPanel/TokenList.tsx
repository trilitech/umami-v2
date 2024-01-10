import { Box, Flex, Heading } from "@chakra-ui/react";

import { ViewAllLink } from "./ViewAllLink";
import { TokenIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { RawPkh } from "../../../types/Address";
import { tokenPrettyAmount } from "../../../types/Token";
import { FA12TokenBalance, FA2TokenBalance } from "../../../types/TokenBalance";
import { TokenNameWithIcon } from "../../../views/tokens/TokenNameWithIcon";
import { NoItems } from "../../NoItems";

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
  return (
    <Box>
      {tokens.map(t => {
        return <TokenTile key={t.contract + (t.type === "fa2" ? t.tokenId : "")} token={t} />;
      })}
      <ViewAllLink to={`/tokens?accounts=${owner}`} />
    </Box>
  );
};
