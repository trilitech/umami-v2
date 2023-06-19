import {
  Box,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import { compact } from "lodash";
import React from "react";
import { CiCircleRemove } from "react-icons/ci";
import { MdOutlineModeEdit } from "react-icons/md";
import { TbFilter } from "react-icons/tb";
import { VscWand } from "react-icons/vsc";
import { useQuery } from "react-query";
import { AccountSmallTile } from "../../components/AccountSelector/AccountSmallTile";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import { Delegation, makeDelegation } from "../../types/Delegation";
import { prettyTezAmount } from "../../utils/format";
import { useAllDelegations, useGetAccountBalance } from "../../utils/hooks/assetsHooks";
import assetsSlice from "../../utils/store/assetsSlice";
import { useAppDispatch } from "../../utils/store/hooks";
import { getBakers } from "../../utils/tezos";
import { useSendFormModal } from "../home/useSendFormModal";
import { useRenderBakerSmallTile } from "./BakerSmallTile";
import NoItems from "../../components/NoItems";

const DelegationsTable = ({
  delegations,
  onRemoveDelegate,
  onChangeDelegate,
}: {
  delegations: Delegation[];
  onRemoveDelegate: (pkh: string) => void;
  onChangeDelegate: (pkh: string, baker: string) => void;
}) => {
  const now = new Date();
  const renderBakerTile = useRenderBakerSmallTile();

  const getAccountBalance = useGetAccountBalance();
  return (
    <TableContainer overflowX="unset" overflowY="unset">
      <Table>
        {
          // Finally a way to have a sticky Header
          // https://github.com/chakra-ui/chakra-ui/discussions/5656#discussioncomment-3320528
        }
        <Thead position="sticky" top={0} zIndex="docked" bg="umami.gray.900" borderRadius={4}>
          <Tr>
            <Th>Account:</Th>
            <Th>Initial Balance:</Th>
            <Th>Current Balance:</Th>
            <Th>Duration:</Th>
            <Th>Last Reward:</Th>
            <Th>Baker:</Th>
          </Tr>
        </Thead>
        <Tbody>
          {delegations.map(d => {
            const balance = getAccountBalance(d.sender);
            return (
              <Tr key={d.id} data-testid="delegation-row">
                <Td>
                  <AccountSmallTile pkh={d.sender} />
                </Td>
                <Td>{d.amount && prettyTezAmount(d.amount)}</Td>
                <Td>{balance && prettyTezAmount(balance)}</Td>
                <Td>{d.timestamp && `Since ${formatRelative(new Date(d.timestamp), now)}`}</Td>
                <Td />
                <Td>
                  <Flex alignItems="center">
                    {renderBakerTile(d.delegate.address)}
                    <IconButton
                      ml={2}
                      mr={2}
                      onClick={() => onChangeDelegate(d.sender, d.delegate.address)}
                      borderRadius="50%"
                      aria-label="Change Baker"
                      icon={<MdOutlineModeEdit />}
                      mb={2}
                    />
                    <IconButton
                      ml={2}
                      mr={2}
                      onClick={() => onRemoveDelegate(d.sender)}
                      borderRadius="50%"
                      aria-label="Delete Baker"
                      icon={<CiCircleRemove />}
                      mb={2}
                    />
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

const DelegateButton = () => {
  const { modalElement, onOpen } = useSendFormModal();

  return (
    <>
      <IconAndTextBtn
        onClick={() =>
          onOpen({
            mode: { type: "delegation" },
          })
        }
        color="umami.green"
        icon={VscWand}
        label="Delegate"
      />

      {modalElement}
    </>
  );
};

export const FilterController: React.FC = () => {
  return (
    <Flex alignItems="center" mb={4} mt={4}>
      <IconAndTextBtn icon={TbFilter} label="Filter" flex={1} />
      <DelegateButton />
    </Flex>
  );
};

const { updateBakers } = assetsSlice.actions;

const DelegationsView = () => {
  const delegations = useAllDelegations();

  const dispatch = useAppDispatch();
  useQuery("bakers", async () => {
    const bakers = await getBakers();
    dispatch(updateBakers(bakers));
  });
  const allDelegations = compact(Object.values(delegations).flat());
  const formatedDelegations = compact(allDelegations.map(makeDelegation));
  const { modalElement, onOpen } = useSendFormModal();

  const handleRemoveDelegate = (pkh: string) => {
    onOpen({
      sender: pkh,
      mode: {
        type: "delegation",
        data: { undelegate: true },
      },
    });
  };

  const handleEditDelegate = (pkh: string, baker: string) => {
    onOpen({
      sender: pkh,
      recipient: baker,
      mode: {
        type: "delegation",
      },
    });
  };

  return (
    <Flex direction="column" height="100%">
      {allDelegations.length > 0 ? (
        <>
          <TopBar title="Delegations" />
          <FilterController />
          <Box overflow="scroll">
            <Box maxH={40} overflow="scroll"></Box>
            <DelegationsTable
              onChangeDelegate={handleEditDelegate}
              onRemoveDelegate={handleRemoveDelegate}
              delegations={formatedDelegations}
            />
          </Box>
          {modalElement}
        </>
      ) : (
        <NoItems text="Currently not delegating" primaryText="Start delegating" />
      )}
    </Flex>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default DelegationsView;
