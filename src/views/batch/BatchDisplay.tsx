import { Box, Button, Divider, Flex, Heading, IconButton, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { AccountOperations } from "../../components/sendForm/types";
import { Account } from "../../types/Account";
import { Operation } from "../../types/Operation";
import { prettyTezAmount } from "../../utils/format";
import { useClearBatch } from "../../utils/hooks/assetsHooks";
import { AccountSmallTile } from "../../components/AccountSelector/AccountSmallTile";
import colors from "../../style/colors";
import pluralize from "pluralize";
import { headerText } from "../../components/SendFlow/SignPageHeader";
import Trash from "../../assets/icons/Trash";
import { nanoid } from "nanoid";
import AddressPill from "../../components/AddressPill/AddressPill";
import { TEZ } from "../../utils/tezos";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import { tokenName, tokenPrettyAmount } from "../../types/Token";

const RightHeader = ({
  operations: { type: operationsType, sender, operations },
}: {
  operations: AccountOperations;
}) => {
  const clearBatch = useClearBatch();
  return (
    <Box justifyContent="space-between" alignItems="center">
      <Text color={colors.gray[400]} size="sm" display="inline-block">
        {pluralize("transaction", operations.length, true)}
      </Text>
      <Button variant="primary" ml="30px">
        {headerText(operationsType, "batch")}
      </Button>
      <IconButton
        onClick={() => clearBatch(sender)} // TODO: add a confirmation modal
        aria-label="remove-batch"
        ml="18px"
        variant="circle"
        borderRadius="4px"
        icon={<Trash />}
      />
    </Box>
  );
};

// TODO: test
export const prettyOperationType = (operation: Operation) => {
  switch (operation.type) {
    case "fa1.2":
    case "fa2":
      return "Token Transfer";
    case "undelegation":
      return "End Delegation";
    case "delegation":
      return "Start Delegation"; // TODO: fix
    case "tez":
      return `${TEZ} Transfer`;
    case "contract_origination":
    case "contract_call":
      return "";
  }
};

const OperationDisplay = ({ operation }: { operation: Operation }) => {
  const getToken = useGetToken();
  switch (operation.type) {
    case "tez":
      return (
        <Flex>
          <Heading size="sm">{prettyTezAmount(operation.amount)}</Heading>
        </Flex>
      );
    case "fa1.2":
    case "fa2": {
      const token = getToken(operation.contract.pkh, operation.tokenId);
      if (token?.type === "nft") {
        // TODO: Add tooltip
        return (
          <Flex>
            {Number(operation.amount) > 1 && (
              <>
                <Heading size="sm" color={colors.gray[450]}>
                  x{operation.amount}
                </Heading>
                &nbsp;
              </>
            )}
            <Heading size="sm">{tokenName(token)}</Heading>
          </Flex>
        );
      }

      const prettyAmount = token
        ? tokenPrettyAmount(operation.amount, token, { showSymbol: true })
        : operation.amount;
      const name = token ? tokenName(token) : undefined;
      // TODO: Finish it. looks ugly. no idea what the token it is
      return (
        <Flex>
          <Tooltip label={name}>
            <Heading size="sm">{prettyAmount}</Heading>
          </Tooltip>
        </Flex>
      );
    }
    // TODO: Add some title
    case "delegation":
    case "undelegation":
    case "contract_origination":
    case "contract_call":
      return null;
  }
};

const OperationRecipient = ({ operation }: { operation: Operation }) => {
  let address;

  switch (operation.type) {
    case "undelegation":
    case "contract_origination":
      address = undefined;
      break;
    case "tez":
    case "fa1.2":
    case "fa2":
    case "delegation":
      address = operation.recipient;
      break;

    case "contract_call":
      address = operation.contract;
      break;
  }
  if (!address) {
    return <Text color={colors.gray[500]}>N/A</Text>;
  }
  return (
    <>
      <Text mr="6px" color={colors.gray[450]}>
        To:
      </Text>
      <AddressPill address={address} />
    </>
  );
};

export const BatchDisplay: React.FC<{
  account: Account;
  operations: AccountOperations;
}> = ({ account, operations: accountOperations }) => {
  const { operations } = accountOperations;

  return (
    <Box data-testid={`batch-table-${account.address.pkh}`} mb={4} w="100%">
      <Flex
        borderTopRadius="8px"
        justifyContent="space-between"
        p="20px 23px 20px 30px"
        bg={colors.gray[800]}
      >
        <Flex alignItems="center">
          <AccountSmallTile pkh={account.address.pkh} pl={0} />
        </Flex>
        <RightHeader operations={accountOperations} />
      </Flex>
      <Flex bg={colors.gray[900]} px="30px" py="20px" flexDirection="column">
        {operations.map((operation, i) => (
          <Box key={nanoid()}>
            <Flex height="50px" flexDirection="column">
              <Flex>
                <OperationDisplay operation={operation} />
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
                    color={colors.gray[300]}
                    icon={<Trash />}
                    borderRadius="full"
                    size="xs"
                    width="24px"
                    variant="circle"
                  />
                </Flex>
              </Flex>
            </Flex>
            {i < operations.length - 1 && <Divider my="20px" />}
          </Box>
        ))}
      </Flex>
      {operations.length > 9 && (
        <Flex
          justifyContent="end"
          borderRadius="0 0 8px 8px"
          p="20px 23px 20px 30px"
          bg={colors.gray[800]}
          verticalAlign="middle"
        >
          <RightHeader operations={accountOperations} />
        </Flex>
      )}
    </Box>
  );
};
