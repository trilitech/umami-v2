import { Box, Flex } from "@chakra-ui/react";
import { useAccountsFilter } from "../../components/useAccountsFilter";
import NoItems from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useGetAccountAllTokens } from "../../utils/hooks/assetsHooks";
import { useSendFormModal } from "../home/useSendFormModal";
import AccountTokensTile from "./AccountTokensTile";

const TokensView = () => {
  const { modalElement, onOpen } = useSendFormModal();

  const { accountsFilter, selectedAccounts } = useAccountsFilter();

  const getTokens = useGetAccountAllTokens();

  const accountsWithTokens = selectedAccounts
    .map(account => [account, getTokens(account.address.pkh)] as const)
    .filter(([, tokens]) => tokens.length > 0);

  if (accountsWithTokens.length === 0) {
    return <NoItems text="No Tokens found" />;
  }

  return (
    <Flex direction="column" height="100%">
      <TopBar title="Tokens" />
      {accountsFilter}

      <Box overflow="auto">
        {accountsWithTokens.map(([account, tokens]) => (
          <AccountTokensTile
            key={account.address.pkh}
            tokens={tokens}
            account={account}
            onOpenSendModal={onOpen}
          />
        ))}
      </Box>
      {modalElement}
    </Flex>
  );
};

export default TokensView;
