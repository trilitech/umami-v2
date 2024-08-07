import { type RawPkh } from "@umami/tezos";

import { useIsOwnedAddress } from "./getAccountData";

export type OperationDestination = "incoming" | "outgoing" | "unrelated";
/**
 * This hook is used to determine if an operation is `outgoing`, `incoming`, or `unrelated`.
 *
 * It can be `unrelated` if a user initiated some operations through a contract call,
 * but isn't a sender or a receiver of assets.
 *
 * @param sender - Who is marked as the operation's sender
 * @returns OperationDestination
 */
export const useGetOperationDestination = (
  sender: RawPkh | null | undefined,
  receiver: RawPkh | null | undefined
): OperationDestination => {
  const isOwned = useIsOwnedAddress();
  const isSenderOwned = isOwned(sender);
  const isReceiverOwned = isOwned(receiver);

  if (!isSenderOwned && !isReceiverOwned) {
    return "unrelated";
  }

  if (isSenderOwned) {
    return "outgoing";
  }

  return "incoming";
};
