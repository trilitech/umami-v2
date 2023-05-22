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
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsArrowDownUp } from "react-icons/bs";
import { MdOutlinePending } from "react-icons/md";
import { RxCheckCircled } from "react-icons/rx";
import { TbFilter } from "react-icons/tb";
import AccountOrContactTile from "../../components/AccountOrContactTile";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import { TzktLink } from "../../components/TzktLink";
import { OperationDisplay } from "../../types/Operation";
import {
  useAllOperationDisplays,
  useIsBlockFinalised,
} from "../../utils/hooks/assetsHooks";
import {
  getIsInbound,
  getKey,
  sortOperationsDisplaysBytDate,
} from "./operationsUtils";

export const FilterController: React.FC = () => {
  return (
    <Flex alignItems={"center"} mb={4} mt={4}>
      <IconAndTextBtn icon={TbFilter} label="Filter" flex={1} />
      <IconAndTextBtn icon={BsArrowDownUp} label="Sort by Newest" mr={4} />
      <IconAndTextBtn icon={AiOutlineUnorderedList} label="List View" />
    </Flex>
  );
};

export const OperationsDataTable: React.FC<{
  operations: OperationDisplay[];
}> = ({ operations }) => {
  const operationList = Object.values(operations).flat();
  const sorted = sortOperationsDisplaysBytDate(operationList);

  const isBlockFinalised = useIsBlockFinalised();
  return (
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
                  <Flex alignItems={"center"}>
                    <Text
                      color={
                        getIsInbound(op.amount.prettyDisplay)
                          ? "umami.green"
                          : "umami.orange"
                      }
                    >
                      {op.amount.prettyDisplay}
                    </Text>
                    {op.amount.url && (
                      <AspectRatio ml={2} height={6} width={6} ratio={4 / 4}>
                        <Image src={op.amount.url} />
                      </AspectRatio>
                    )}
                  </Flex>
                </Td>
                <Td>{op.fee}</Td>
                <Td>
                  <AccountOrContactTile pkh={op.sender} />
                </Td>
                <Td>
                  <AccountOrContactTile pkh={op.recipient} />
                </Td>
                <Td>
                  {isBlockFinalised(op.level) ? (
                    <IconAndTextBtn icon={RxCheckCircled} label="Confirmed" />
                  ) : (
                    <IconAndTextBtn
                      icon={MdOutlinePending}
                      label="Pending..."
                    />
                  )}
                </Td>
                <Td>
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Text>{op.prettyTimestamp}</Text>
                    {op.tzktUrl && (
                      <TzktLink url={op.tzktUrl} ml={2} w={4} h={4} />
                    )}
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
  const allOperations = useAllOperationDisplays();
  const allOperationsList = Object.values(allOperations).flat();

  return (
    <Flex direction="column" height={"100%"}>
      <TopBar title="Operations" />

      <FilterController />

      <Box overflow="scroll" pb={4}>
        <OperationsDataTable operations={allOperationsList} />
      </Box>
    </Flex>
  );
};

export default OperationsView;
