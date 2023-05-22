import {
  AspectRatio,
  Box,
  Button,
  Divider,
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
import AccountOrContactTile from "../../components/AccountOrContactTile";
import { AccountSmallTile } from "../../components/AccountSelector/AccountSmallTile";
import {
  Fee,
  Subtotal,
  Total,
} from "../../components/sendForm/components/TezAmountRecaps";
import { OperationValue } from "../../components/sendForm/types";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";
import { Account } from "../../types/Account";
import { formatTokenAmount, NFT } from "../../types/Asset";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { Batch } from "../../utils/store/assetsSlice";
import { tzktExplorer } from "../../utils/tezos/consts";
import { getBatchSubtotal, getTotalFee } from "./batchUtils";
import { getIPFSurl } from "../../utils/token/nftUtils";

const renderAmount = (operation: OperationValue) => {
  switch (operation.type) {
    case "token": {
      const amount =
        operation.data instanceof NFT
          ? operation.data.balance
          : formatTokenAmount(
              `${operation.value.amount}`,
              operation.data.metadata?.decimals
            );
      return (
        <Flex>
          <Text mr={1}>{amount} </Text>

          {operation.data instanceof NFT ? (
            <AspectRatio ml={2} height={6} width={6} ratio={4 / 4}>
              <Image src={getIPFSurl(operation.data.metadata.displayUri)} />
            </AspectRatio>
          ) : (
            operation.data.symbol()
          )}
        </Flex>
      );
    }
    case "tez":
      return prettyTezAmount(operation.value.amount);
    case "delegation":
      return "";
  }
};

const RightPanel = ({
  batch,
  onDelete,
  onSend,
}: {
  batch: Batch;
  onDelete: () => void;
  onSend: () => void;
}) => {
  const fee = getTotalFee(batch.items);

  const subTotal = getBatchSubtotal(batch.items.map((item) => item.operation));

  const total = subTotal.plus(fee);
  return (
    <Flex bg="umami.gray.800" w={292} p={4} flexDirection="column">
      <Box flex={1}>
        <Subtotal mutez={subTotal} marginY={4} />
        <Fee mutez={fee} />
      </Box>
      <Box>
        <Divider />
        <Total mutez={total} paddingY={3} />

        <Flex justifyContent={"space-between"}>
          <Button
            onClick={onSend}
            isDisabled={batch.isSimulating}
            flex={1}
            bg="umami.blue"
            mr={4}
          >
            Submit batch
          </Button>

          <IconButton
            isDisabled={batch.isSimulating}
            onClick={onDelete}
            aria-label="Delete Batch"
            icon={<BsTrash />}
          />
        </Flex>
      </Box>
    </Flex>
  );
};

export const BatchDisplay: React.FC<{
  account: Account;
  batch: Batch;
  onDelete: () => void;
  onSend: () => void;
}> = ({ account, batch, onDelete, onSend }) => {
  const items = batch.items;
  const network = useSelectedNetwork();

  return (
    <Flex data-testid="batch-table" mb={4}>
      <Box flex={1} bg="umami.gray.900" p={4}>
        <Flex justifyContent="space-between" ml={2} mr={2} mb={4}>
          <AccountSmallTile ml={2} pkh={account.pkh} label={account.label} />
          <Text color={"umami.gray.400"}>
            {`${items.length} transaction${items.length > 1 ? "s" : ""}`}
          </Text>
        </Flex>
        <TableContainer overflowX="unset" overflowY="unset">
          <Table>
            <Thead
              position="sticky"
              top={0}
              zIndex="docked"
              bg="umami.gray.900"
              borderRadius={4}
            >
              <Tr>
                <Th>Type:</Th>
                <Th>Subject:</Th>
                <Th>Contract:</Th>
                <Th>Recipient:</Th>
                <Th>Fee:</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map(({ operation, fee }, i) => (
                <Tr key={operation.value.sender + operation.type + i}>
                  <Td>
                    {operation.type !== "delegation"
                      ? "Transaction"
                      : operation.type}
                  </Td>
                  <Td>{renderAmount(operation)}</Td>
                  <Td>
                    {operation.type === "token" && (
                      <TextAndIconBtn
                        text={formatPkh(operation.data.contract)}
                        icon={FiExternalLink}
                        onClick={() => {
                          window.open(
                            `${tzktExplorer[network]}/${operation.data.contract}`,
                            "_blank"
                          );
                        }}
                      />
                    )}
                  </Td>
                  <Td>
                    {operation.value.recipient && (
                      <AccountOrContactTile pkh={operation.value.recipient} />
                    )}
                  </Td>
                  <Td>{prettyTezAmount(fee)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <RightPanel onDelete={onDelete} onSend={onSend} batch={batch} />
    </Flex>
  );
};
