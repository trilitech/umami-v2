import { Heading } from "@chakra-ui/react";

import { useGetOperationDestination } from "./useGetOperationDestination";
import colors from "../../style/colors";
import { TzktCombinedOperation } from "../../utils/tezos";

/**
 * "Internal: " prefix for operations which weren't directly initiated by the user.
 * It might happen when a user interacts with a contract and the operation was caused by a call.
 *
 *
 * @param operation -
 */
export const InternalPrefix: React.FC<{
  operation: TzktCombinedOperation;
}> = ({ operation }) => {
  let target;
  let sender;

  switch (operation.type) {
    case "transaction":
      target = operation.target?.address;
      sender = operation.sender.address;
      break;
    case "origination":
    case "delegation":
      target = null;
      sender = operation.sender.address;
      break;
    case "token_transfer":
      target = operation.to?.address;
      sender = operation.from?.address;
      break;
  }

  const operationDestination = useGetOperationDestination(sender, target);

  if (operationDestination !== "unrelated") {
    return null;
  }

  return (
    <Heading marginRight="4px" color={colors.gray[450]} size="md">
      Internal:
    </Heading>
  );
};
