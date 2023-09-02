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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { BsTrash } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import AddressPill from "../../components/AddressPill/AddressPill";
import { IconAndTextBtnLink } from "../../components/IconAndTextBtn";
import { FormOperations } from "../../components/sendForm/types";
import { Account, AccountType } from "../../types/Account";
import { Operation } from "../../types/Operation";
import { formatTokenAmount, tokenSymbol } from "../../types/Token";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { TokenLookup, useGetToken } from "../../utils/hooks/tokensHooks";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { buildTzktAddressUrl } from "../../utils/tzkt/helpers";
import { AccountSmallTile } from "../../components/AccountSelector/AccountSmallTile";
import colors from "../../style/colors";

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

const RightPanel = ({
  account,
  onDelete,
  onSend,
}: {
  account: Account;
  onDelete: () => void;
  onSend: () => void;
}) => {
  return (
    <Flex bg={colors.gray[800]} w={292} p={4} flexDirection="column">
      <Flex justifyContent="space-between">
        <Button onClick={onSend} flex={1} mr={4}>
          {account.type === AccountType.MULTISIG ? "Propose batch" : "Submit batch"}
        </Button>

        <IconButton onClick={onDelete} aria-label="Delete Batch" icon={<BsTrash />} />
      </Flex>
    </Flex>
  );
};

export const BatchDisplay: React.FC<{
  account: Account;
  operations: FormOperations;
  onDelete: () => void;
  onSend: () => void;
}> = ({ account, operations, onDelete, onSend }) => {
  const network = useSelectedNetwork();
  const getToken = useGetToken();

  return (
    <Flex data-testid={`batch-table-${account.address.pkh}`} mb={4}>
      <Box flex={1} bg={colors.gray[900]} p={4}>
        <Flex justifyContent="space-between" ml={2} mr={2} mb={4}>
          <AccountSmallTile ml={2} pkh={account.address.pkh} />
          <Text color={colors.gray[400]}>
            {/* TODO: use pluralize.js for that */}
            {`${operations.operations.length} transaction${
              operations.operations.length > 1 ? "s" : ""
            }`}
          </Text>
        </Flex>
        <TableContainer overflowX="unset" overflowY="unset">
          <Table>
            <Thead position="sticky" top={0} zIndex="docked" bg={colors.gray[900]} borderRadius={4}>
              <Tr>
                <Th>Type:</Th>
                <Th>Subject:</Th>
                <Th>Contract:</Th>
                <Th>Recipient:</Th>
              </Tr>
            </Thead>
            <Tbody>
              {operations.operations.map((operation, i) => (
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
                    {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                    {"recipient" in operation && operation.recipient && (
                      <AddressPill address={operation.recipient} />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <RightPanel account={account} onDelete={onDelete} onSend={onSend} />
    </Flex>
  );
};
