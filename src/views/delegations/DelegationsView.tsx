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
import { compact } from "lodash";
import { ReactNode } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { MdOutlineModeEdit } from "react-icons/md";
import { VscWand } from "react-icons/vsc";
import { useAccountsFilterWithMapFilter } from "../../components/useAccountsFilter";
import { AccountSmallTile } from "../../components/AccountSelector/AccountSmallTile";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { NoDelegations } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { Delegation, makeDelegation } from "../../types/Delegation";
import { objectMap } from "../../utils/helpers";
import { useFirstAccount } from "../../utils/hooks/accountHooks";
import { useAllDelegations } from "../../utils/hooks/assetsHooks";
import { useGetDelegationPrettyDisplayValues } from "../../utils/hooks/delegationHooks";
import { useSendFormModal } from "../home/useSendFormModal";
import { useRenderBakerSmallTile } from "./BakerSmallTile";
import colors from "../../style/colors";

const DelegationsTable = ({
  delegations,
  onRemoveDelegate,
  onChangeDelegate,
}: {
  delegations: Delegation[];
  onRemoveDelegate: (pkh: string) => void;
  onChangeDelegate: (pkh: string, baker: string) => void;
}) => {
  const renderBakerTile = useRenderBakerSmallTile();

  const getDelegationPrettyDisplay = useGetDelegationPrettyDisplayValues();
  return (
    <TableContainer>
      <Table>
        {
          // Finally a way to have a sticky Header
          // https://github.com/chakra-ui/chakra-ui/discussions/5656#discussioncomment-3320528
        }
        <Thead position="sticky" top={0} zIndex="1" bg={colors.gray[900]} borderRadius={4}>
          <Tr>
            <Th>Account:</Th>
            <Th>Initial Balance:</Th>
            <Th>Current Balance:</Th>
            <Th>Duration:</Th>
            <Th>Last Reward:</Th>
            <Th>Baker:</Th>
            <Th>{/* For buttons */}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {delegations.map(delegation => {
            const { currentBalance, duration, initialBalance } =
              getDelegationPrettyDisplay(delegation);
            return (
              <Tr key={delegation.id} data-testid="delegation-row">
                <Td>
                  <AccountSmallTile pkh={delegation.sender} />
                </Td>
                <Td>{initialBalance}</Td>
                <Td>{currentBalance}</Td>
                <Td>{duration}</Td>
                <Td />
                <Td>{renderBakerTile(delegation.delegate.address)}</Td>
                <Td>
                  <IconButton
                    ml={2}
                    mr={2}
                    onClick={() => onChangeDelegate(delegation.sender, delegation.delegate.address)}
                    borderRadius="50%"
                    aria-label="Change Baker"
                    icon={<MdOutlineModeEdit />}
                    mb={2}
                  />
                  <IconButton
                    ml={2}
                    mr={2}
                    onClick={() => onRemoveDelegate(delegation.sender)}
                    borderRadius="50%"
                    aria-label="Delete Baker"
                    icon={<CiCircleRemove />}
                    mb={2}
                  />
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
  const account = useFirstAccount();

  return (
    <>
      <IconAndTextBtn
        onClick={() =>
          onOpen({
            sender: account.address.pkh,
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

export const FilterController: React.FC<{ children: ReactNode }> = props => {
  return (
    <Flex alignItems="center" mb={4} mt={4}>
      {props.children}
      <DelegateButton />
    </Flex>
  );
};

const DelegationsView = () => {
  const { modalElement, onOpen } = useSendFormModal();

  const delegationsOps = useAllDelegations();
  const { filterMap: filter, accountsFilter } = useAccountsFilterWithMapFilter();
  const delegationsArrays = objectMap(delegationsOps, d => (d ? [d] : undefined));
  const delegationsToDisplay = compact(filter(delegationsArrays).map(makeDelegation));
  const account = useFirstAccount();

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
      <TopBar title="Delegations" />
      <Flex alignItems="left" justifyContent="space-between">
        {accountsFilter}
        <DelegateButton />
      </Flex>
      {delegationsToDisplay.length > 0 ? (
        <Box overflowY="auto">
          <DelegationsTable
            onChangeDelegate={handleEditDelegate}
            onRemoveDelegate={handleRemoveDelegate}
            delegations={delegationsToDisplay}
          />
        </Box>
      ) : (
        <NoDelegations
          onDelegate={() => {
            onOpen({
              sender: account.address.pkh,
              mode: { type: "delegation" },
            });
          }}
        />
      )}
      {modalElement}
    </Flex>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default DelegationsView;
