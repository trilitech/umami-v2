import {
  type ImplicitAccount,
  type MultisigAccount,
  estimate,
  makeAccountOperations,
  makeMultisigApproveOrExecuteOperation,
} from "@umami/core";
import { type MultisigOperation, parseRawMichelson } from "@umami/multisig";
import { type ImplicitAddress } from "@umami/tezos";
import type React from "react";
import { useContext } from "react";

import { MultisigActionButton, type MultisigSignerState } from "./MultisigActionButton";
import colors from "../../../../style/colors";
import { useGetImplicitAccountSafe } from "../../../../utils/hooks/getAccountDataHooks";
import { useSelectedNetwork } from "../../../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../../../utils/hooks/useAsyncActionHandler";
import { AccountTileBase, LabelAndAddress } from "../../../AccountTile/AccountTile";
import { AddressTileIcon } from "../../../AddressTile/AddressTileIcon";
import { useAddressKind } from "../../../AddressTile/useAddressKind";
import { DynamicModalContext } from "../../../DynamicModal";
import { SignPage } from "../../../SendFlow/Multisig/SignPage";

export const MultisigSignerTile: React.FC<{
  signerAddress: ImplicitAddress;
  pendingApprovals: number;
  operation: MultisigOperation;
  sender: MultisigAccount;
}> = ({ pendingApprovals, sender, operation, signerAddress }) => {
  const addressKind = useAddressKind(signerAddress);
  const getImplicitAccount = useGetImplicitAccountSafe();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const network = useSelectedNetwork();

  const signer = getImplicitAccount(signerAddress.pkh);

  const operationIsExecutable = pendingApprovals === 0;

  const approveOrExecute = () =>
    handleAsyncAction(async () => {
      if (!signer) {
        throw new Error("Can't approve or execute with an account you don't own");
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
