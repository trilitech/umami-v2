import React from "react";

import { ContractCallTile } from "./ContractCallTile";
import { DelegationTile } from "./DelegationTile";
import { OriginationTile } from "./OriginationTile";
import { TokenTransferTile } from "./TokenTransferTile";
import { TransactionTile } from "./TransactionTile";
import { fromRaw } from "../../types/Token";
import { useGetTokenTransfer } from "../../utils/hooks/assetsHooks";
import { TzktCombinedOperation } from "../../utils/tezos";

export const OperationTile: React.FC<{
  operation: TzktCombinedOperation;
}> = ({ operation }) => {
  const getTokenTransfer = useGetTokenTransfer();

  switch (operation.type) {
    case "token_transfer": {
      const token = fromRaw(operation.token);
      if (token) {
        return <TokenTransferTile token={token} tokenTransfer={operation} />;
      }
      console.warn(`Could not parse token transfer ${operation.id}`);
      return null;
    }
    case "transaction": {
      const isContractCall = !!operation.parameter;
      const tokenTransfer = getTokenTransfer(operation.id);

      if (tokenTransfer) {
        const token = fromRaw(tokenTransfer.token);
        if (token) {
          return (
            <TokenTransferTile operation={operation} token={token} tokenTransfer={tokenTransfer} />
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
