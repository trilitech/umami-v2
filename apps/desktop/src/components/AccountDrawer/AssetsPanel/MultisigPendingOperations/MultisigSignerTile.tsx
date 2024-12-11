import { useAddressKind, useDynamicModalContext } from "@umami/components";
import {
  type ImplicitAccount,
  type MultisigAccount,
  estimate,
  makeAccountOperations,
  makeMultisigApproveOrExecuteOperation,
} from "@umami/core";
import { type MultisigOperation, parseRawMichelson } from "@umami/multisig";
import { useAsyncActionHandler, useGetImplicitAccountSafe, useSelectedNetwork } from "@umami/state";
import { type ImplicitAddress } from "@umami/tezos";
import { CustomError } from "@umami/utils";

import { MultisigActionButton, type MultisigSignerState } from "./MultisigActionButton";
import colors from "../../../../style/colors";
import { AccountTileBase, LabelAndAddress } from "../../../AccountTile/AccountTile";
import { AddressTileIcon } from "../../../AddressTile/AddressTileIcon";
import { SignPage } from "../../../SendFlow/Multisig/SignPage";

export const MultisigSignerTile = ({
  pendingApprovals,
  sender,
  operation,
  signerAddress,
}: {
  signerAddress: ImplicitAddress;
  pendingApprovals: number;
  operation: MultisigOperation;
  sender: MultisigAccount;
}) => {
  const addressKind = useAddressKind(signerAddress);
  const getImplicitAccount = useGetImplicitAccountSafe();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();
  const network = useSelectedNetwork();

  const signer = getImplicitAccount(signerAddress.pkh);

  const operationIsExecutable = pendingApprovals === 0;

  const approveOrExecute = () =>
    handleAsyncAction(async () => {
      if (!signer) {
        throw new CustomError("Can't approve or execute with an account you don't own");
      }

      const actionType = operationIsExecutable ? "execute" : "approve";

      const approveOrExecute = makeAccountOperations(signer, signer, [
        makeMultisigApproveOrExecuteOperation(sender.address, actionType, operation.id),
      ]);
      const estimatedOperations = await estimate(approveOrExecute, network);

      let transactionCount;
      try {
        transactionCount = parseRawMichelson(operation.rawActions, sender).length;
      } catch {
        // for cases when we cannot parse the actions
        transactionCount = 1;
      }

      return openWith(
        <SignPage
          actionType={actionType}
          operation={estimatedOperations}
          signer={signer}
          transactionCount={transactionCount}
        />
      );
    });

  const signerState = getMultisigSignerState({
    approvals: operation.approvals,
    signerAddress,
    operationIsExecutable,
    signerAccount: signer,
  });

  return (
    <AccountTileBase
      height="80px"
      marginTop="10px"
      marginBottom="0"
      padding="15px"
      borderRadius="8px"
      backgroundColor={colors.gray[700]}
      icon={<AddressTileIcon addressKind={addressKind} size="lg" />}
      leftElement={<LabelAndAddress label={addressKind.label} pkh={addressKind.pkh} />}
      rightElement={
        <MultisigActionButton
          approveOrExecute={approveOrExecute}
          data-testid="multisig-signer-button"
          isLoading={isLoading}
          signerState={signerState}
        />
      }
    />
  );
};

const getMultisigSignerState = ({
  signerAccount,
  operationIsExecutable,
  approvals,
  signerAddress: signer,
}: {
  signerAccount?: ImplicitAccount;
  operationIsExecutable: boolean;
  approvals: ImplicitAddress[];
  signerAddress: ImplicitAddress;
}): MultisigSignerState => {
  const approvedBySigner = !!approvals.find(approver => approver.pkh === signer.pkh);

  if (!signerAccount) {
    return approvedBySigner ? "approved" : "awaitingApprovalByExternalSigner";
  }

  if (approvedBySigner && !operationIsExecutable) {
    return "approved";
  }

  return operationIsExecutable ? "executable" : "approvable";
};
