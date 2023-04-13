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
import { AccountSmallTile } from "../../components/AccountSelector/AccountSmallTile";
import {
  Fee,
  Subtotal,
  Total,
} from "../../components/sendForm/components/TezAmountRecaps";
import { TransactionValues } from "../../components/sendForm/types";
import { Account } from "../../types/Account";
import { formatPkh } from "../../utils/format";
import { Batch } from "../../utils/store/assetsSlice";
import {
  mutezToTezNumber,
  prettyTezAmount,
} from "../../utils/store/impureFormat";

const renderAmount = (t: TransactionValues) => {
  if (t.type === "delegation") {
    return "";
  }

  if (t.type === "nft") {
    return (
      <Flex>
        <Text>{t.values.amount}</Text>
        <AspectRatio ml={2} height={6} width={6} ratio={4 / 4}>
          <Image src={t.data.metadata.displayUri} />
        </AspectRatio>
      </Flex>
    );
  }
  if (t.type === "tez") {
    return prettyTezAmount(t.values.amount, true);
  }
};

const RightPanel = ({
  batch,
  onDelete,
}: {
  batch: Batch;
  onDelete: () => void;
}) => {
  const fee = batch.items.reduce((acc, curr) => {
    return acc + curr.fee;
  }, 0);
  const subTotal = batch.items.reduce((acc, curr) => {
    if (curr.transaction.type === "tez") {
      return acc + curr.transaction.values.amount;
    } else {
      return acc;
    }
  }, 0);

  const total = subTotal + mutezToTezNumber(fee);
  return (
    <Flex bg="umami.gray.800" w={292} p={4} flexDirection="column">
      <Box flex={1}>
        <Fee mutez={fee} />
        <Subtotal tez={subTotal} />
      </Box>
      <Box>
        <Divider />
        <Total tez={total} />

        <Flex justifyContent={"space-between"}>
          <Button
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
}> = ({ account, batch, onDelete }) => {
  const items = batch.items;
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
            {
              // Finally a way to have a sticky Header
              // https://github.com/chakra-ui/chakra-ui/discussions/5656#discussioncomment-3320528
            }
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
                <Th>Recipient:</Th>
                <Th>Fee:</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((b, i) => {
                return (
                  <Tr
                    // TODO add getKey method
                    key={b.transaction.values.sender + b.transaction.type + i}
                  >
                    <Td>{b.transaction.type}</Td>
                    <Td>{renderAmount(b.transaction)}</Td>
                    <Td>
                      {b.transaction.values.recipient &&
                        formatPkh(b.transaction.values.recipient)}
                    </Td>
                    <Td>{prettyTezAmount(b.fee)}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <RightPanel onDelete={onDelete} batch={batch} />
    </Flex>
  );
};
