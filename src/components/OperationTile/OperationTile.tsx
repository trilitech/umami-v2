import React from "react";
import { useGetTokenTransfer } from "../../utils/hooks/assetsHooks";
import { TzktCombinedOperation } from "../../utils/tezos";
import { TransactionTile } from "./TransactionTile";
import { ContractCallTile } from "./ContractCallTile";
import { OriginationTile } from "./OriginationTile";
import { DelegationTile } from "./DelegationTile";
import { TokenTransferTile } from "./TokenTransferTile";
import { fromRaw } from "../../types/Token";

export const OperationTile: React.FC<{
  operation: TzktCombinedOperation;
}> = ({ operation }) => {
  const getTokenTransfer = useGetTokenTransfer();

  switch (operation.type) {
    case "transaction": {
      const isContractCall = !!operation.parameter;
      const tokenTransfer = getTokenTransfer(operation.id);

      if (tokenTransfer) {
        const token = fromRaw(tokenTransfer.token);
        if (token) {
          return (
            <TokenTransferTile operation={operation} tokenTransfer={tokenTransfer} token={token} />
          );
        } else {
          // If we can't parse the token we fallback to
          // the transaction tile because it is a transaction by nature
          return <TransactionTile operation={operation} />;
        }
      } else if (isContractCall) {
        return <ContractCallTile operation={operation} />;
      } else {
        return <TransactionTile operation={operation} />;
      }
    }
    case "delegation":
      return <DelegationTile operation={operation} />;

    case "origination":
      return <OriginationTile operation={operation} />;
  }
};
