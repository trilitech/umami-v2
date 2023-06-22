import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
import NoItems from "../../components/NoItems";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";
import { TopBar } from "../../components/TopBar";
import { navigateToExternalLink } from "../../utils/helpers";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { useHasTokens } from "../../utils/hooks/assetsHooks";
import { useSendFormModal } from "../home/useSendFormModal";
import AccountTokensTile from "./AccountTokensTile";

export const FilterController: React.FC = () => {
  return (
    <Flex alignItems="center" mb={4} mt={4}>
      <TextAndIconBtn icon={AiOutlineArrowDown} text="Filter by Account" onClick={() => {}} />
    </Flex>
  );
};

const TokensView = () => {
  const accounts = useAllAccounts();
  const { modalElement, onOpen } = useSendFormModal();

  const hasTokens = useHasTokens();
  return (
    <Flex direction="column" height="100%">
      {hasTokens() ? (
        <>
          <TopBar title="Tokens" />
          <FilterController />
          <Box overflow="scroll">
            {accounts.map(account => (
              <AccountTokensTile
                key={account.address.pkh}
                account={account}
                onOpenSendModal={onOpen}
              />
            ))}
          </Box>
          {modalElement}
        </>
      ) : (
        <NoItems
          text="No tokens found"
          primaryText="Buy your first Token"
          onClickPrimary={() => {
            navigateToExternalLink(`https://quipuswap.com/`);
          }}
        />
      )}
    </Flex>
  );
};

export default TokensView;
