import { Box, Flex } from "@chakra-ui/react";
import { useAccountsFilter } from "../../components/useAccountsFilter";
import NoItems from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useGetAccountAllTokens } from "../../utils/hooks/assetsHooks";
import AccountTokensTile from "./AccountTokensTile";

const TokensView = () => {
  const { accountsFilter, selectedAccounts } = useAccountsFilter();

  const getTokens = useGetAccountAllTokens();

  const accountsWithTokens = selectedAccounts
    .map(account => [account, getTokens(account.address.pkh)] as const)
    .filter(([, tokens]) => tokens.length > 0);

  return (
    <Flex direction="column" height="100%">
      <TopBar title="Tokens" />
      {accountsFilter}
      {accountsWithTokens.length === 0 ? (
        <NoItems text="No Tokens found" />
      ) : (
        <Box overflow="auto">
          {accountsWithTokens.map(([account, tokens]) => (
            <AccountTokensTile key={account.address.pkh} tokens={tokens} account={account} />
          ))}
        </Box>
      )}
    </Flex>
  );
};

export default TokensView;
