import { Box, Button, Divider, Flex, IconButton, Text } from "@chakra-ui/react";
import { compact } from "lodash";
import { nanoid } from "nanoid";
import pluralize from "pluralize";
import React, { useContext, useState } from "react";

import { AccountSmallTile } from "./AccountSmallTile";
import { EstimateStatus, getEstimateStatus, getEstimateStatusColor } from "./estimateStatus";
import { OperationRecipient } from "./OperationRecipient";
import { OperationView } from "./OperationView";
import { CheckmarkIcon, ExclamationIcon, TrashIcon, WarningIcon } from "../../assets/icons";
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

// Converts from 1 => 1st, 2 => 2nd, 3 => 3rd... etc.
export const addOrdinal = (n: number): string => {
  let ordinal = "th";

  if (n % 10 == 1 && n % 100 != 11) {
    ordinal = "st";
  } else if (n % 10 == 2 && n % 100 != 12) {
    ordinal = "nd";
  } else if (n % 10 == 3 && n % 100 != 13) {
    ordinal = "rd";
  }

  return `${n}${ordinal}`;
};

const RightHeader: React.FC<{
  operations: AccountOperations;
  onBatchSubmit: () => Promise<void>;
  batchSubmitIsLoading: boolean;
}> = ({ operations: accountOperations, onBatchSubmit, batchSubmitIsLoading }) => {
  const { type: operationsType, sender, operations } = accountOperations;
  const { openWith } = useContext(DynamicModalContext);

  return (
    <Box alignItems="center" justifyContent="space-between" data-testid="right-header">
      <Text display="inline-block" color={colors.gray[400]} size="sm">
        {pluralize("transaction", operations.length, true)}
      </Text>
      <Button
        marginLeft="30px"
        isLoading={batchSubmitIsLoading}
        onClick={onBatchSubmit}
        variant="primary"
      >
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

const getEstimateStatusIcon = (status: EstimateStatus) => {
  const color = getEstimateStatusColor(status);
  switch (status) {
    case "Estimated":
      return <CheckmarkIcon height="14.5px" />;
    case "Failed":
      return <WarningIcon width="13px" height="12px" stroke={color} />;
    case "Not Estimated":
      return <ExclamationIcon stroke={color} />;
  }
};

export const BatchView: React.FC<{
  operations: AccountOperations;
}> = ({ operations: accountOperations }) => {
  const { operations, sender } = accountOperations;
  const removeItem = useRemoveBatchItem();

  const showFooter = operations.length > 9;

  const { openWith } = useContext(DynamicModalContext);

  const { handleAsyncAction, isLoading: batchSubmitIsLoading } = useAsyncActionHandler();
  const network = useSelectedNetwork();

  // lastEstimatedIndex is the index of the operation that was estimated last.
  // if the estimatedIndex === operations.length, then the entire batch was estimated successfully.
  const [lastEstimatedIndex, setLastEstimatedIndex] = useState<null | number>(null);

  const onBatchSubmit = () =>
    handleAsyncAction(async () => {
      try {
        const initialFee = await estimate(accountOperations, network);
        setLastEstimatedIndex(accountOperations.operations.length);
        openWith(<SignPage initialFee={initialFee} initialOperations={accountOperations} />);
      } catch (_) {
        // In case of error, we identify the specific operation in the batch.
        for (let i = 0; i < operations.length; i += 1) {
          const operation = operations[i];
          try {
            await estimate({ ...accountOperations, operations: [operation] }, network);
          } catch (error: any) {
            const operationType = prettyOperationType(operation);
            setLastEstimatedIndex(i);
            throw new Error(
              `The ${addOrdinal(i + 1)} operation "${operationType}" is invalid: ${error.message}`
            );
          }
        }
      }
    });

  return (
    <Box width="100%" marginBottom="16px" data-testid={`batch-table-${sender.address.pkh}`}>
      <Flex
        justifyContent="space-between"
        padding="20px 23px 25px 30px"
        background={colors.gray[800]}
        borderTopRadius="8px"
        data-testid="header"
      >
        <Flex alignItems="center">
          <AccountSmallTile paddingLeft={0} account={sender} />
        </Flex>
        <RightHeader
          batchSubmitIsLoading={batchSubmitIsLoading}
          onBatchSubmit={onBatchSubmit}
          operations={accountOperations}
        />
      </Flex>
      <Flex
        flexDirection="column"
        background={colors.gray[900]}
        borderBottomRadius={showFooter ? 0 : "8px"}
        paddingX="30px"
        paddingY="20px"
      >
        {operations.map((operation, index) => {
          const estimateStatus =
            lastEstimatedIndex !== null ? getEstimateStatus(index, lastEstimatedIndex) : null;
          return (
            <Box key={nanoid()} data-testid="operation">
              <Flex flexDirection="column" height={estimateStatus ? "70px" : "50px"}>
                <Flex>
                  <OperationView operation={operation} />
                </Flex>

                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  marginTop="8px"
                >
                  <Box>
                    <Flex>
                      <OperationRecipient operation={operation} />
                    </Flex>
                    {estimateStatus && (
                      <Flex alignItems="center" marginTop="8px">
                        {getEstimateStatusIcon(estimateStatus)}
                        <Text
                          marginLeft="4px"
                          color={getEstimateStatusColor(estimateStatus)}
                          size="xs"
                        >
                          {estimateStatus}
                        </Text>
                      </Flex>
                    )}
                  </Box>
                  <Flex>
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
          <RightHeader
            batchSubmitIsLoading={batchSubmitIsLoading}
            onBatchSubmit={onBatchSubmit}
            operations={accountOperations}
          />
        </Flex>
      )}
    </Box>
  );
};
