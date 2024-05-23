import { Flex, FlexProps, Heading, Text } from "@chakra-ui/react";

import { PendingUnstakeRequest } from "./PendingUnstakeRequest";
import colors from "../../../../style/colors";
import { ImplicitAccount } from "../../../../types/Account";
import { useGetAccountUnstakeRequests } from "../../../../utils/hooks/assetsHooks";

export const PendingUnstakeRequests: React.FC<{ account: ImplicitAccount } & FlexProps> = ({
  account,
  ...props
}) => {
  const pendingUnstakeRequests = useGetAccountUnstakeRequests()(account.address.pkh);

  if (pendingUnstakeRequests.length === 0) {
    return null;
  }

  return (
    <Flex
      flexDirection="column"
      gap="20px"
      width="100%"
      padding="15px"
      background={colors.gray[800]}
      borderRadius="8px"
      {...props}
    >
      <Flex justifyContent="space-between">
        <Heading size="sm">Pending Unstake</Heading>
        <Text color={colors.gray[400]} size="sm">
          {pendingUnstakeRequests.length}
        </Text>
      </Flex>
      <Flex flexDirection="column" gap="10px">
        {pendingUnstakeRequests.map(request => (
          <PendingUnstakeRequest key={request.timestamp} account={account} request={request} />
        ))}
      </Flex>
    </Flex>
  );
};
