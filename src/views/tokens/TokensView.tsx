import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { NoTokens } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { useHasTokens } from "../../utils/hooks/assetsHooks";
import { useSendFormModal } from "../home/useSendFormModal";
import AccountTokensTile from "./AccountTokensTile";

export const FilterController: React.FC = () => {
  return (
    <Flex alignItems="center" mb={4} mt={4}>
      <IconAndTextBtn
        icon={AiOutlineArrowDown}
        label="Filter by Account"
        onClick={() => {}}
        textFirst
      />
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
        <NoTokens />
      )}
    </Flex>
  );
};

export default TokensView;
