import {
  AspectRatio,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { BsTrash } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import AddressPill from "../../components/AddressPill/AddressPill";
import { IconAndTextBtnLink } from "../../components/IconAndTextBtn";
import { AccountOperations } from "../../components/sendForm/types";
import { Account } from "../../types/Account";
import { Operation } from "../../types/Operation";
import { formatTokenAmount, tokenSymbol } from "../../types/Token";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { TokenLookup, useGetToken } from "../../utils/hooks/tokensHooks";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { buildTzktAddressUrl } from "../../utils/tzkt/helpers";
import { AccountSmallTile } from "../../components/AccountSelector/AccountSmallTile";
import colors from "../../style/colors";
import pluralize from "pluralize";
import { headerText } from "../../components/SendFlow/SignPageHeader";

const renderAmount = (operation: Operation, getToken: TokenLookup) => {
  switch (operation.type) {
    case "fa1.2":
    case "fa2": {
      const token = getToken(operation.contract.pkh, operation.tokenId);
      if (!token) {
        throw new Error(`Token not found ${operation.contract.pkh} ${operation.tokenId}}`);
      }
      const amount = formatTokenAmount(operation.amount, token.metadata?.decimals);
      return (
        <Flex>
          <Text mr={1}>{amount} </Text>

          {token.type === "nft" ? (
            <AspectRatio ml={2} height={6} width={6} ratio={1}>
              <Image src={getIPFSurl(token.metadata.displayUri)} />
            </AspectRatio>
          ) : (
            <Text>{tokenSymbol(token)}</Text>
          )}
        </Flex>
      );
    }
    case "tez":
      return prettyTezAmount(operation.amount);
    case "delegation":
    case "undelegation":
    case "contract_origination":
    case "contract_call":
      return "";
  }
};

export const BatchDisplay: React.FC<{
  account: Account;
  operations: AccountOperations;
}> = ({ account, operations: accountOperations }) => {
  const { operations, type: operationsType } = accountOperations;
  const network = useSelectedNetwork();
  const getToken = useGetToken();

  return (
    <Flex data-testid={`batch-table-${account.address.pkh}`} mb={4}>
      <Box flex={1}>
        <Flex
          justifyContent="space-between"
          borderRadius="8px 8px 0 0"
          p="20px 23px 20px 30px"
          bg={colors.gray[800]}
          verticalAlign="middle"
        >
          <Box pt="5px">
            <AccountSmallTile pkh={account.address.pkh} />
          </Box>
          <Box justifyContent="space-between" verticalAlign="middle">
            <Text color={colors.gray[400]} size="sm" display="inline-block">
              {pluralize("transaction", operations.length, true)}
            </Text>
            <Button size="sm" variant="primary" ml="30px">
              {headerText(operationsType, "batch")}
            </Button>
            <IconButton aria-label="remove-batch" ml="18px" size="sm" icon={<BsTrash />} />
          </Box>
        </Flex>
        <TableContainer overflowX="unset" overflowY="unset">
          <Table>
            <Tbody>
              {operations.map((operation, i) => (
                // TODO: add better key for operations
                // If you add two 1-tez transfers to the same recipient, the key will be the same
                // `i` should not be used in the key
                <Tr key={operation.type + i}>
                  <Td>{operation.type !== "delegation" ? "Transaction" : operation.type}</Td>
                  <Td>{renderAmount(operation, getToken)}</Td>
                  <Td>
                    {(operation.type === "fa2" || operation.type === "fa1.2") && (
                      <IconAndTextBtnLink
                        label={formatPkh(operation.contract.pkh)}
                        icon={FiExternalLink}
                        href={buildTzktAddressUrl(network, operation.contract.pkh)}
                        textFirst
                      />
                    )}
                  </Td>
                  <Td>
                    {"recipient" in operation && <AddressPill address={operation.recipient} />}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
};
