import {
  AspectRatio,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
  Tooltip,
  Image,
} from "@chakra-ui/react";
import React from "react";
import { AccountOperations } from "../../components/sendForm/types";
import { Operation } from "../../types/Operation";
import { prettyTezAmount } from "../../utils/format";
import {
  useClearBatch,
  useRemoveBatchItem,
  useSelectedNetwork,
} from "../../utils/hooks/assetsHooks";
import { AccountSmallTile } from "../../components/AccountSelector/AccountSmallTile";
import colors from "../../style/colors";
import pluralize from "pluralize";
import { headerText } from "../../components/SendFlow/SignPageHeader";
import Trash from "../../assets/icons/Trash";
import { nanoid } from "nanoid";
import AddressPill from "../../components/AddressPill/AddressPill";
import { TEZ } from "../../utils/tezos";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import {
  Token,
  thumbnailUri,
  tokenName,
  tokenNameSafe,
  tokenPrettyAmount,
  tokenSymbol,
  tokenUri,
} from "../../types/Token";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { compact } from "lodash";

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
      throw new Error(`${operation.type} is not suported yet`);
  }
};

export const tokenTitle = (token: Token | undefined, amount: string) => {
  const name = token ? tokenName(token) : undefined;

  const prettyAmount = token ? tokenPrettyAmount(amount, token, { showSymbol: false }) : amount;

  // don't show the symbol if the token name is present
  const symbol = !name && token ? tokenSymbol(token) : undefined;
  return compact([prettyAmount, symbol, name]).join(" ");
};

export const OperationView = ({ operation }: { operation: Operation }) => {
  const getToken = useGetToken();
  const network = useSelectedNetwork();

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
            <Heading size="sm">
              <Tooltip
                bg={colors.gray[700]}
                border="1px solid"
                borderColor={colors.gray[500]}
                borderRadius="8px"
                p="8px"
                label={
                  <AspectRatio w="170px" h="170px" ratio={1}>
                    <Image src={getIPFSurl(thumbnailUri(token))} />
                  </AspectRatio>
                }
              >
                <Link href={tokenUri(token, network)}>{tokenNameSafe(token)}</Link>
              </Tooltip>
            </Heading>
          </Flex>
        );
      }

      return (
        <Flex>
          <Heading size="sm">
            <Link href={token ? tokenUri(token, network) : undefined}>
              {tokenTitle(token, operation.amount)}
            </Link>
          </Heading>
        </Flex>
      );
    }
    case "delegation":
      return (
        <Flex>
          <Heading size="sm">Delegate</Heading>
        </Flex>
      );
    case "undelegation":
      return (
        <Flex>
          <Heading size="sm">End Delegation</Heading>
        </Flex>
      );
    case "contract_origination":
    case "contract_call":
      throw new Error(`${operation.type} is not suported yet`);
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

export const BatchView: React.FC<{
  operations: AccountOperations;
}> = ({ operations: accountOperations }) => {
  const { operations, sender } = accountOperations;
  const removeItem = useRemoveBatchItem();

  return (
    <Box data-testid={`batch-table-${sender.address.pkh}`} mb={4} w="100%">
      <Flex
        borderTopRadius="8px"
        justifyContent="space-between"
        p="20px 23px 20px 30px"
        bg={colors.gray[800]}
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
        borderBottomRadius={operations.length > 9 ? 0 : "8px"}
      >
        {operations.map((operation, index) => (
          <Box key={nanoid()}>
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
                    color={colors.gray[300]}
                    icon={<Trash />}
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
