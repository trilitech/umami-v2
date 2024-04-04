import colors from "../../style/colors";
import { RawPkh } from "../../types/Address";
import { useIsOwnedAddress } from "../../utils/hooks/getAccountDataHooks";

export type OperationDestination = "incoming" | "outgoing" | "unrelated";

/**
 * This hook is used to determine if an operation is outgoing, incoming, or unrelated.
 *
 * It can be unrelated if a user initiated some operations through a contract call,
 * but isn't a sender or a receiver of assets.
 *
 * @param sender - Who is marked as the operation's sender
 * @returns OperationDestination
 */
export const useGetOperationDestination = (
  sender: RawPkh | null | undefined,
  receiver: RawPkh | null | undefined
) => {
  const isSenderOwned = useIsOwnedAddress(sender || "");
  const isReceiverOwned = useIsOwnedAddress(receiver || "");

  if (!isSenderOwned && !isReceiverOwned) {
    return "unrelated";
  }

  if (isSenderOwned) {
    return "outgoing";
  }

  return "incoming";
};

export const operationSign = (destination: OperationDestination) => {
  switch (destination) {
    case "incoming":
      return "+";
    case "outgoing":
      return "-";
    case "unrelated":
      return "";
  }
};

export const operationColor = (destination: OperationDestination) => {
  switch (destination) {
    case "incoming":
      return colors.green;
    case "outgoing":
      return colors.orange;
    case "unrelated":
      return "white";
  }
};
