import { Flex, type FlexProps, Heading, Text } from "@chakra-ui/react";
import { type ImplicitAccount } from "@umami/core";
import {
  useAccountPendingUnstakeRequests,
  useAccountTotalFinalizableUnstakeAmount,
} from "@umami/state";

import { FinalizableUnstakeRequest } from "./FinalizableUnstakeRequest";
import { PendingUnstakeRequest } from "./PendingUnstakeRequest";
import colors from "../../../../style/colors";

/**
 * Component that displays the pending unstake requests for an account
 * It combines all finalizable requests into one and displays them as a single request at the top
 *
 * If there are no pending unstake requests, it returns null
 *
 * @param account - account to display the pending unstake requests for
 */
//TODO: test
export const PendingUnstakeRequests = ({
  account,
  ...props
}: { account: ImplicitAccount } & FlexProps) => {
  const pendingUnstakeRequests = useAccountPendingUnstakeRequests(account.address.pkh);
  const totalFinalizableAmount = useAccountTotalFinalizableUnstakeAmount(account.address.pkh);

  const totalOperationsCount =
    pendingUnstakeRequests.length + (totalFinalizableAmount.eq(0) ? 0 : 1);

  if (!totalOperationsCount) {
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
          {totalOperationsCount}
        </Text>
      </Flex>
      <Flex flexDirection="column" gap="10px">
        <FinalizableUnstakeRequest account={account} />
        {pendingUnstakeRequests.map(request => (
          <PendingUnstakeRequest key={request.cycle} request={request} />
        ))}
      </Flex>
    </Flex>
  );
};
