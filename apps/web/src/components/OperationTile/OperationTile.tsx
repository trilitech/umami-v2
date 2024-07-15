import { type FlexProps } from "@chakra-ui/react";
import { fromRawToken } from "@umami/core";
import { useGetTokenTransfer } from "@umami/state";
import { type TzktCombinedOperation } from "@umami/tzkt";
import { memo } from "react";

import { ContractCallTile } from "./ContractCallTile";
import { DelegationTile } from "./DelegationTile";
import { FinalizeUnstakeTile } from "./FinalizeUnstakeTile";
import { OriginationTile } from "./OriginationTile";
import { StakeTile } from "./StakeTile";
import { TokenTransferTile } from "./TokenTransferTile";
import { TransactionTile } from "./TransactionTile";
import { UnstakeTile } from "./UnstakeTile";

export const OperationTile = memo(
  ({ operation, ...props }: { operation: TzktCombinedOperation } & FlexProps) => {
    const getTokenTransfer = useGetTokenTransfer();

    switch (operation.type) {
      case "token_transfer": {
        const token = fromRawToken(operation.token);
        if (token) {
          return <TokenTransferTile token={token} tokenTransfer={operation} {...props} />;
        }
        console.warn(`Could not parse token transfer ${operation.id}`);
        return null;
      }
      case "transaction": {
        const isContractCall = !!operation.parameter;
        const tokenTransfer = getTokenTransfer(operation.id);

        if (tokenTransfer) {
          const token = fromRawToken(tokenTransfer.token);
          if (token) {
            return (
              <TokenTransferTile
                operation={operation}
                token={token}
                tokenTransfer={tokenTransfer}
                {...props}
              />
            );
          } else {
            // If we can't parse the token we fallback to
            // the transaction tile because it is a transaction by nature
            return <TransactionTile operation={operation} {...props} />;
          }
        } else if (isContractCall) {
          return <ContractCallTile operation={operation} {...props} />;
        } else {
          return <TransactionTile operation={operation} {...props} />;
        }
      }
      case "delegation":
        return <DelegationTile operation={operation} {...props} />;

      case "origination":
        return <OriginationTile operation={operation} {...props} />;

      case "stake":
        return <StakeTile operation={operation} {...props} />;

      case "unstake":
        return <UnstakeTile operation={operation} {...props} />;

      case "finalize":
        return <FinalizeUnstakeTile operation={operation} {...props} />;
    }
  }
);
