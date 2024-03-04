import { useContext } from "react";

import { OperationTileContext } from "./OperationTileContext";
import { RawPkh } from "../../types/Address";
import { useIsOwnedAddress } from "../../utils/hooks/getAccountDataHooks";

/**
 * This hook is used to determine if an operation is outgoing or not
 * It operates in two modes depending on the Operation Tile Context.
 *
 * If it's used on the Operations page then it will only check if the sender is an owned account
 *   if both sender and target are owned it will be considered outgoing
 *   if the sender === target and it's owned the operation will be considered outgoing
 *
 * If it's used inside an account drawer then it will check if the sender === this account account
 *   if both sender and target are owned it will be considered incoming
 *   if sender === target then it's still an outgoing operation
 *
 * More context:
 *   since on the operations page we also render the fee, it does make sense to mark an operation
 *   as outgoing if the sender is an owned account, even if the target is also an owned account.
 *   (incoming operations do not display the fee because they aren't paid by the wallet user)
 *
 *   in the drawer we don't show the fees, but we have a selected account and it doesn't make sense
 *   to mark an operation as outgoing if the sender is one of the owned accounts and the target is the selected one.
 *   in this case, the operation is incoming, because the selected account has received something.
 *
 * if the sender is a falsy value then it will return `false`
 * because it's definitely not an outgoing operation.
 * such a case might occur if a token transfer was initiated by a contract origination.
 * such operations do not have a sender.
 *
 * @param sender - Who initiated the operation
 * @returns boolean
 */
export const useIsOutgoingOperation = (sender: RawPkh) => {
  const tileContext = useContext(OperationTileContext);
  const isOwned = useIsOwnedAddress(sender);

  // some token transactions do not have a sender
  if (!sender) {
    return false;
  }

  if (tileContext.mode === "page") {
    return isOwned;
  }

  return sender === tileContext.selectedAddress.pkh;
};
