import { Card, Flex } from "@chakra-ui/react";
import { useAppSelector } from "@umami/state";

export const Sidebar = () => {
  const accounts = useAppSelector(s => s.accounts.items);
  return (
    <Card gap="20px" padding="8px 8px 8px 20px">
      <Flex gap="40px">{accounts.length && <Flex>Current account: {accounts[0].label}</Flex>}</Flex>
    </Card>
  );
};
