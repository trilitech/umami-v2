import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";
import { TopBar } from "../../components/TopBar";
import { useAccounts } from "../../utils/hooks/accountHooks";
import { useSendFormModal } from "../home/useSendFormModal";
import AccountTokensTile from "./AccountTokensTile";

export const FilterController: React.FC = () => {
  return (
    <Flex alignItems={"center"} mb={4} mt={4}>
      <TextAndIconBtn
        icon={AiOutlineArrowDown}
        text="Filter by Account"
        onClick={() => {}}
      />
    </Flex>
  );
};

const TokensView = () => {
  const accounts = useAccounts();
  const { modalElement, onOpen } = useSendFormModal();
  return (
    <Flex direction="column" height={"100%"}>
      <TopBar title="Tokens" />
      <FilterController />
      <Box overflow={"scroll"}>
        {accounts.map((account) => (
          <AccountTokensTile account={account} onOpenSendModal={onOpen} />
        ))}
      </Box>

      {modalElement}
    </Flex>
  );
};

export default TokensView;
