import { Box, Button, Divider, Flex, IconButton, Text } from "@chakra-ui/react";
import { nanoid } from "@reduxjs/toolkit";
import type { OperationContentsAndResult } from "@taquito/rpc";
import { TezosOperationError } from "@taquito/taquito";
import { compact } from "lodash";
import pluralize from "pluralize";
import React, { useContext, useEffect } from "react";

import { AccountSmallTile } from "./AccountSmallTile";
import { OperationEstimationStatus } from "./OperationEstimationStatus";
import { OperationRecipient } from "./OperationRecipient";
import { OperationView } from "./OperationView";
import { TrashIcon } from "../../assets/icons";
import { accountIconGradient } from "../../components/AccountTile/AccountTile";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { DynamicModalContext } from "../../components/DynamicModal";
import { SignPage } from "../../components/SendFlow/Batch/SignPage";
import { headerText } from "../../components/SendFlow/SignPageHeader";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { AccountOperations } from "../../types/AccountOperations";
import { Operation } from "../../types/Operation";
import { Token, tokenName, tokenPrettyAmount, tokenSymbol } from "../../types/Token";
import { useClearBatch, useRemoveBatchItem } from "../../utils/hooks/batchesHooks";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { TEZ, estimate } from "../../utils/tezos";

const RightHeader: React.FC<{
  operations: AccountOperations;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}> = ({ operations: accountOperations, onSubmit, isLoading }) => {
  const { type: operationsType, sender, operations } = accountOperations;
  const { openWith } = useContext(DynamicModalContext);

  return (
    <Box alignItems="center" justifyContent="space-between" data-testid="right-header">
      <Text display="inline-block" color={colors.gray[400]} size="sm">
        {pluralize("transaction", operations.length, true)}
      </Text>
      <Button marginLeft="30px" isLoading={isLoading} onClick={onSubmit} variant="primary">
        {headerText(operationsType, "batch")}
      </Button>
      <IconButton
        marginLeft="16px"
        borderRadius="4px"
        aria-label="remove-batch"
        data-testid="remove-batch"
        icon={<TrashIcon stroke={colors.gray[300]} />}
        onClick={() => openWith(<ClearBatchConfirmationModal sender={sender} />, "sm")}
        variant="circle"
      />
    </Box>
  );
};

const prettyOperationType = (operation: Operation) => {
  switch (operation.type) {
    case "fa1.2":
    case "fa2":
      return "Token Transfer";
    case "undelegation":
    case "delegation":
      return "Delegation";
    case "tez":
      return `${TEZ} Transfer`;
    case "contract_origination":
    case "contract_call":
      throw new Error(`${operation.type} is not supported yet`);
  }
};

const ClearBatchConfirmationModal = ({ sender }: { sender: Account }) => {
  const clearBatch = useClearBatch();

  return (
    <ConfirmationModal
      buttonLabel="Delete Batch"
      description="Are you sure you want to remove all transactions from the batch?"
      onSubmit={() => clearBatch(sender)}
      title="Delete Batch"
    />
  );
};

export const tokenTitle = (token: Token | undefined, amount: string) => {
  if (!token) {
    return `${amount} Unknown Token`;
  }
  const name = tokenName(token);
  const prettyAmount = tokenPrettyAmount(amount, token, { showSymbol: false });

  // don't show the symbol if the token name is present
  const symbol = name ? undefined : tokenSymbol(token);

  return compact([prettyAmount, symbol, name]).join(" ");
};

const SUCCESSFUL_ESTIMATION_RESULT = {
  metadata: { operation_result: { status: "applied" } },
} as OperationContentsAndResult;

export const BatchView: React.FC<{
  operations: AccountOperations;
}> = ({ operations: accountOperations }) => {
  const { operations, sender } = accountOperations;
  const showFooter = operations.length > 9;

  const removeItem = useRemoveBatchItem();
  const { openWith } = useContext(DynamicModalContext);
  const network = useSelectedNetwork();
  const [operationsEstimationResults, setOperationsEstimationResults] = React.useState<
    OperationContentsAndResult[]
  >([]);

  // if we change operations list anyhow the estimation statuses become irrelevant
  useEffect(() => {
    setOperationsEstimationResults([]);
  }, [operations.length]);

  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const openBatchSignPage = () =>
    handleAsyncAction(async () => {
      // clean statuses until we have actual estimation results
      setOperationsEstimationResults([]);

      try {
        const initialFee = await estimate(accountOperations, network);

        // if the estimation succeeds we set all operations' statuses to successful
        setOperationsEstimationResults(operations.map(_ => SUCCESSFUL_ESTIMATION_RESULT));

        openWith(<SignPage initialFee={initialFee} initialOperations={accountOperations} />);
      } catch (error: any) {
        // This exception contains per-operation info on its estimation status and errors if any
        // It's thrown if there were any errors during the estimation
        if (error instanceof TezosOperationError) {
          const operationStatuses = error.operationsWithResults;

          // on the first account operation taquito inserts
          // a reveal operation to the beginning of the batch
          // to keep the mapping correct we need to
          // remove it from the statuses array
          if (operationStatuses.length > operations.length) {
            operationStatuses.shift();
          }
          setOperationsEstimationResults(operationStatuses);
        }
        throw error;
      }
    });

  const actionsBlock = (
    <RightHeader
      isLoading={isLoading}
      onSubmit={openBatchSignPage}
      operations={accountOperations}
    />
  );

  return (
    <Box width="100%" marginBottom="16px" data-testid={`batch-table-${sender.address.pkh}`}>
      <Flex
        justifyContent="space-between"
        padding="20px 23px 20px 30px"
        background={accountIconGradient({
          top: "-10px",
          left: "-10px",
          account: sender,
          radius: "100px",
          opacity: "40",
          mainBackgroundColor: colors.gray[800],
        })}
        borderTopRadius="8px"
        data-testid="header"
      >
        <Flex alignItems="center">
          <AccountSmallTile paddingLeft={0} account={sender} />
        </Flex>
        {actionsBlock}
      </Flex>
      <Flex
        flexDirection="column"
        background={colors.gray[900]}
        borderBottomRadius={showFooter ? 0 : "8px"}
        paddingX="30px"
        paddingY="20px"
      >
        {operations.map((operation, index) => {
          const estimationResult = operationsEstimationResults.at(index);

          return (
            <Box key={nanoid()} data-testid="operation">
              <Flex flexDirection="column" height={estimationResult ? "80px" : "50px"}>
                <Flex>
                  <OperationView operation={operation} />
                </Flex>

                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  marginTop="8px"
                >
                  <Flex flexDirection="column">
                    <Flex>
                      <OperationRecipient operation={operation} />
                    </Flex>
                    <OperationEstimationStatus estimationResult={estimationResult} />
                  </Flex>

                  <Flex alignSelf="flex-end">
                    <Text alignSelf="flex-end" color={colors.gray[450]} size="sm">
                      {prettyOperationType(operation)}
                    </Text>
                    <IconButton
                      width="24px"
                      marginLeft="12px"
                      borderRadius="full"
                      aria-label="Remove"
                      icon={<TrashIcon stroke={colors.gray[300]} />}
                      onClick={() => removeItem(sender, index)}
                      size="xs"
                      variant="circle"
                    />
                  </Flex>
                </Flex>
              </Flex>
              {index < operations.length - 1 && <Divider marginY="20px" />}
            </Box>
          );
        })}
      </Flex>
      {showFooter && (
        <Flex
          justifyContent="end"
          verticalAlign="middle"
          padding="20px 23px 20px 30px"
          background={colors.gray[800]}
          borderRadius="0 0 8px 8px"
          data-testid="footer"
        >
          {actionsBlock}
        </Flex>
      )}
    </Box>
  );
};
