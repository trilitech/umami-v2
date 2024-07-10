import { Heading } from "@chakra-ui/react";
import { useGetOperationDestination } from "@umami/state";
import { type TzktCombinedOperation } from "@umami/tzkt";

import colors from "../../style/colors";

/**
 * "Internal: " prefix for operations which weren't directly initiated by the user.
 * It might happen when a user interacts with a contract and the operation was caused by a call.
 *
 *
 * @param operation -
 */
export const InternalPrefix = ({ operation }: { operation: TzktCombinedOperation }) => {
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
    case "stake":
    case "unstake":
    case "finalize":
      target = operation.sender.address;
      sender = operation.sender.address;
  }

  const operationDestination = useGetOperationDestination(sender, target);

  if (operationDestination !== "unrelated") {
    return null;
  }

  return (
    <Heading marginRight="4px" color={colors.gray[450]} data-testid="internal-prefix" size="md">
      Internal:
    </Heading>
  );
};
