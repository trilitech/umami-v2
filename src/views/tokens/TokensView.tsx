import { Box, Flex } from "@chakra-ui/react";
import { intersectionWith } from "lodash";
import { ReactNode } from "react";
import { useAccountFilter } from "../../components/AccountFilter";
import { NoTokens } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { Account } from "../../types/Account";
import { Address } from "../../types/Address";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { useGetAccountAllTokens } from "../../utils/hooks/assetsHooks";
import { useSendFormModal } from "../home/useSendFormModal";
import AccountTokensTile from "./AccountTokensTile";

export const getFilteredAccounts = (accounts: Account[], accountFilter: Address[]) =>
  accountFilter.length === 0
    ? accounts
    : intersectionWith(
        accounts,
        accountFilter,
        (account, address) => account.address.pkh === address.pkh
      );

const useFilterTokensView = () => {
  const { filterElement, accountFilter } = useAccountFilter();
  const accounts = useAllAccounts();

  return {
    filteredAccounts: getFilteredAccounts(accounts, accountFilter),
    filterElement,
  };
};

const TokensView = () => {
  const { modalElement, onOpen } = useSendFormModal();

  const { filterElement, filteredAccounts } = useFilterTokensView();

  const getTokens = useGetAccountAllTokens();

  const els = filteredAccounts.reduce<ReactNode[]>((acc, curr) => {
    const tokens = getTokens(curr.address.pkh);

    if (tokens.length === 0) {
      return acc;
    }

    return [
      ...acc,
      <AccountTokensTile
        key={curr.address.pkh}
        tokens={tokens}
        account={curr}
        onOpenSendModal={onOpen}
      />,
    ];
  }, []);

  return (
    <Flex direction="column" height="100%">
      <TopBar title="Tokens" />
      {filterElement}

      {els.length > 0 ? <Box overflow="scroll">{els}</Box> : <NoTokens />}
      {modalElement}
    </Flex>
  );
};

export default TokensView;
