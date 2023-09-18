import React, { useContext } from "react";
import { ImplicitAccount, MultisigAccount } from "../../../../types/Account";
import { ImplicitAddress } from "../../../../types/Address";
import { useGetImplicitAccountSafe } from "../../../../utils/hooks/accountHooks";
import { useGetContactName } from "../../../../utils/hooks/contactsHooks";
import { useAsyncActionHandler } from "../../../../utils/hooks/useAsyncActionHandler";
import { MultisigOperation } from "../../../../utils/multisig/types";
import { MultisigSignerState } from "./MultisigActionButton";
import { makeAccountOperations } from "../../../../types/AccountOperations";
import { makeMultisigApproveOrExecuteOperation } from "../../../../types/Operation";
import { estimate } from "../../../../utils/tezos";
import { DynamicModalContext } from "../../../DynamicModal";
import SignPage from "../../../SendFlow/Multisig/SignPage";
import { MultisigSignerTileDisplay } from "./MultisigSignerTileDisplay";
import { useSelectedNetwork } from "../../../../utils/hooks/networkHooks";
import { parseRawMichelson } from "../../../../multisig/decode/decodeLambda";

const MultisigSignerTile: React.FC<{
  signerAddress: ImplicitAddress;
  pendingApprovals: number;
  operation: MultisigOperation;
  sender: MultisigAccount;
}> = ({ pendingApprovals, sender, operation, signerAddress }) => {
  const getContactName = useGetContactName();
  const getImplicitAccount = useGetImplicitAccountSafe();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const network = useSelectedNetwork();

  const implicitAccount = getImplicitAccount(signerAddress.pkh);
  const contactName = getContactName(signerAddress.pkh);

  const accountLabel = implicitAccount?.label;

  const label = accountLabel || contactName;

  const signer = getImplicitAccount(signerAddress.pkh);

  const operationIsExecutable = pendingApprovals === 0;

  const kind = contactName ? "contact" : signer?.type ?? "unknown";

  const onButtonClick = () =>
    handleAsyncAction(async () => {
      if (!signer) {
        throw new Error("Can't approve or execute with an account you don't own");
      }

      const actionType = operationIsExecutable ? "execute" : "approve";

      const approveOrExecute = makeAccountOperations(signer, signer, [
        makeMultisigApproveOrExecuteOperation(sender.address, actionType, operation.id),
      ]);
      const fee = await estimate(approveOrExecute, network);

      const transactionCount = parseRawMichelson(operation.rawActions, sender).length;

      openWith(
        <SignPage
          fee={fee}
          actionType={actionType}
          signer={signer}
          operation={approveOrExecute}
          transactionCount={transactionCount}
        />
      );
    });

  return (
    <MultisigSignerTileDisplay
      kind={kind}
      pkh={signerAddress.pkh}
      label={label}
      signerState={getMultisigSignerState({
        approvals: operation.approvals,
        signerAddress,
        operationIsExecutable,
        signerAccount: signer,
      })}
      onClickApproveExecute={onButtonClick}
      isLoading={isLoading}
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
export default MultisigSignerTile;
