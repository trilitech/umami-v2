import { Box, Button, Divider, Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AccountOperations } from "../../types/AccountOperations";
import { Operation } from "../../types/Operation";
import { AccountSmallTile } from "../../components/AccountSelector/AccountSmallTile";
import colors from "../../style/colors";
import pluralize from "pluralize";
import { headerText } from "../../components/SendFlow/SignPageHeader";
import TrashIcon from "../../assets/icons/Trash";
import { nanoid } from "nanoid";
import { TEZ, estimate } from "../../utils/tezos";
import { Token, tokenName, tokenPrettyAmount, tokenSymbol } from "../../types/Token";
import { compact } from "lodash";
import { DynamicModalContext } from "../../components/DynamicModal";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { Account } from "../../types/Account";
import { OperationView } from "./OperationView";
import { OperationRecipient } from "./OperationRecipient";
import { useClearBatch, useRemoveBatchItem } from "../../utils/hooks/batchesHooks";
import SignPage from "../../components/SendFlow/Batch/SignPage";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";

const RightHeader: React.FC<{ operations: AccountOperations }> = ({
  operations: accountOperations,
}) => {
  const { type: operationsType, sender, operations } = accountOperations;
  const { openWith } = useContext(DynamicModalContext);

  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const network = useSelectedNetwork();

  const openBatchSignPage = () =>
    handleAsyncAction(async () => {
      const initialFee = await estimate(accountOperations, network);
      openWith(<SignPage initialFee={initialFee} initialOperations={accountOperations} />);
    });

  return (
    <Box justifyContent="space-between" alignItems="center" data-testid="right-header">
      <Text color={colors.gray[400]} size="sm" display="inline-block">
        {pluralize("transaction", operations.length, true)}
      </Text>
      <Button variant="primary" ml="30px" onClick={openBatchSignPage} isLoading={isLoading}>
        {headerText(operationsType, "batch")}
      </Button>
      <IconButton
        onClick={() => openWith(<ClearBatchConfirmationModal sender={sender} />, "sm")}
        aria-label="remove-batch"
        ml="18px"
        variant="circle"
        borderRadius="4px"
        icon={<TrashIcon stroke={colors.gray[300]} />}
        data-testid="remove-batch"
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
      title="Are you sure?"
      description="It will remove all the transactions from the batch."
      onSubmit={() => clearBatch(sender)}
      buttonLabel="Clear"
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

export const BatchView: React.FC<{
  operations: AccountOperations;
}> = ({ operations: accountOperations }) => {
  const { operations, sender } = accountOperations;
  const removeItem = useRemoveBatchItem();

  const showFooter = operations.length > 9;

  return (
    <Box data-testid={`batch-table-${sender.address.pkh}`} mb="16px" w="100%">
      <Flex
        borderTopRadius="8px"
        justifyContent="space-between"
        p="20px 23px 20px 30px"
        bg={colors.gray[800]}
        data-testid="header"
      >
        <Flex alignItems="center">
          <AccountSmallTile pkh={sender.address.pkh} pl={0} />
        </Flex>
        <RightHeader operations={accountOperations} />
      </Flex>
      <Flex
        bg={colors.gray[900]}
        px="30px"
        py="20px"
        flexDirection="column"
        borderBottomRadius={showFooter ? 0 : "8px"}
      >
        {operations.map((operation, index) => (
          <Box key={nanoid()} data-testid="operation">
            <Flex height="50px" flexDirection="column">
              <Flex>
                <OperationView operation={operation} />
              </Flex>

              <Flex mt="8px" width="100%" alignItems="center" justifyContent="space-between">
                <Flex>
                  <OperationRecipient operation={operation} />
                </Flex>
                <Flex>
                  <Text size="sm" color={colors.gray[450]} alignSelf="flex-end">
                    {prettyOperationType(operation)}
                  </Text>
                  <IconButton
                    ml="12px"
                    aria-label="Remove"
                    icon={<TrashIcon stroke={colors.gray[300]} />}
                    borderRadius="full"
                    size="xs"
                    width="24px"
                    variant="circle"
                    onClick={() => removeItem(sender, index)}
                  />
                </Flex>
              </Flex>
            </Flex>
            {index < operations.length - 1 && <Divider my="20px" />}
          </Box>
        ))}
      </Flex>
      {showFooter && (
        <Flex
          justifyContent="end"
          borderRadius="0 0 8px 8px"
          p="20px 23px 20px 30px"
          bg={colors.gray[800]}
          verticalAlign="middle"
          data-testid="footer"
        >
          <RightHeader operations={accountOperations} />
        </Flex>
      )}
    </Box>
  );
};
