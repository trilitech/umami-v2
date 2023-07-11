import {
  AspectRatio,
  Box,
  Flex,
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
import { MdOutlinePending } from "react-icons/md";
import { RxCheckCircled } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useAccountsFilterWithMapFilter } from "../../components/useAccountsFilter";
import AccountOrContactTile from "../../components/AccountOrContactTile";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { NoOperations } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { TzktLink } from "../../components/TzktLink";
import { OperationDisplay } from "../../types/Transfer";
import { useGetOperationDisplays, useIsBlockFinalised } from "../../utils/hooks/assetsHooks";
import { getAmountColor, getKey, sortOperationsByTimestamp } from "./operationsUtils";

export const OperationsDataTable: React.FC<{
  operations: OperationDisplay[];
}> = ({ operations }) => {
  const operationList = Object.values(operations).flat();
  const sorted = sortOperationsByTimestamp(operationList);

  const isBlockFinalised = useIsBlockFinalised();
  return (
    <TableContainer overflowX="unset" overflowY="unset">
      <Table>
        {
          // Finally a way to have a sticky Header
          // https://github.com/chakra-ui/chakra-ui/discussions/5656#discussioncomment-3320528
        }
        <Thead position="sticky" top={0} zIndex="1" bg="umami.gray.900" borderRadius={4}>
          <Tr>
            <Th>Type:</Th>
            <Th>Amount:</Th>
            <Th>Fee:</Th>
            <Th>Sender:</Th>
            <Th>Recipient:</Th>
            <Th>Status:</Th>
            <Th>Timestamp:</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sorted.map((op, i) => {
            return (
              <Tr
                key={
                  // TODO: find a better way to pick a unique ID per operation.
                  // Dupes appear when doing transfers within accounts on the same wallet...
                  getKey(op)
                }
              >
                <Td>{op.type}</Td>
                <Td>
                  <Flex alignItems="center">
                    <Text color={getAmountColor(op.amount.prettyDisplay)}>
                      {op.amount.prettyDisplay}
                    </Text>
                    {op.amount.url && (
                      <Link to={`/nfts/${op.amount.id}`}>
                        <AspectRatio ml={2} height={6} width={6} ratio={1}>
                          <Image src={op.amount.url} />
                        </AspectRatio>
                      </Link>
                    )}
                  </Flex>
                </Td>
                <Td>{op.fee}</Td>
                <Td>
                  <AccountOrContactTile pkh={op.sender.pkh} />
                </Td>
                <Td>
                  <AccountOrContactTile pkh={op.recipient.pkh} />
                </Td>
                <Td>
                  {isBlockFinalised(op.level) ? (
                    <IconAndTextBtn icon={RxCheckCircled} label="Confirmed" />
                  ) : (
                    <IconAndTextBtn icon={MdOutlinePending} label="Pending..." />
                  )}
                </Td>
                <Td>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text>{op.prettyTimestamp}</Text>
                    {op.tzktUrl && <TzktLink url={op.tzktUrl} ml={2} w={4} h={4} />}
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const OperationsView = () => {
  const { filterMap: filter, accountsFilter } = useAccountsFilterWithMapFilter();
  const operations = useGetOperationDisplays();
  const operationsToDisplay = sortOperationsByTimestamp(filter(operations));

  return (
    <Flex direction="column" height="100%">
      <TopBar title="Operations" />
      {accountsFilter}
      {operationsToDisplay.length > 0 ? (
        <Box overflow="scroll" pb={4}>
          <OperationsDataTable operations={operationsToDisplay} />
        </Box>
      ) : (
        <NoOperations />
      )}
    </Flex>
  );
};

export default OperationsView;
