import { Box, Flex } from "@chakra-ui/react";

import { AccountTokens } from "./AccountTokens";
import { NoItems } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useAccountsFilter } from "../../components/useAccountsFilter";
import { useGetAccountAllTokens } from "../../utils/hooks/assetsHooks";

export const TokensPage = () => {
  const { accountsFilter, selectedAccounts } = useAccountsFilter();

  const getTokens = useGetAccountAllTokens();

  const accountsWithTokens = selectedAccounts
    .map(account => [account, getTokens(account.address.pkh)] as const)
    .filter(([, tokens]) => tokens.length > 0);

  return (
    <Flex flexDirection="column" height="100%">
      <TopBar title="Tokens" />
      {accountsFilter}
      {accountsWithTokens.length === 0 ? (
        <NoItems title="No Tokens found" />
      ) : (
        <Box overflowY="auto">
          {accountsWithTokens.map(([account, tokens]) => (
            <AccountTokens key={account.address.pkh} account={account} tokens={tokens} />
          ))}
        </Box>
      )}
    </Flex>
  );
};
