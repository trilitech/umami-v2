import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useAccountFilterUtils } from "../../components/AccountFilter";
import { NoTokens } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useGetAccountAllTokens } from "../../utils/hooks/assetsHooks";
import { useSendFormModal } from "../home/useSendFormModal";
import AccountTokensTile from "./AccountTokensTile";

const TokensView = () => {
  const { modalElement, onOpen } = useSendFormModal();

  const { filteredAccounts, filterElement } = useAccountFilterUtils();

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
