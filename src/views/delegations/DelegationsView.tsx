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
import { useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import { useAllDelegations } from "../../utils/hooks/assetsHooks";
import { useGetDelegationPrettyDisplayValues } from "../../utils/hooks/delegationHooks";
import colors from "../../style/colors";
import { BakerSmallTile } from "./BakerSmallTile";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";
import DelegationFormPage from "../../components/SendFlow/Delegation/FormPage";
import { useSendFormModal } from "../home/useSendFormModal";

const DelegationsTable = ({
  delegations,
  onClickUndelegate,
}: {
  delegations: Delegation[];
  //TODO: remove after undelegete is implemented
  onClickUndelegate: (sender: string) => void;
}) => {
  const getDelegationPrettyDisplay = useGetDelegationPrettyDisplayValues();
  const { openWith } = useContext(DynamicModalContext);
  const getOwnedAccount = useGetOwnedAccount();
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
                <Td>
                  <BakerSmallTile pkh={delegation.delegate.address} />
                </Td>
                <Td>
                  <IconButton
                    ml={2}
                    mr={2}
                    onClick={() => {
                      openWith(
                        <DelegationFormPage
                          sender={getOwnedAccount(delegation.sender)}
                          form={{ sender: delegation.sender, baker: delegation.delegate.address }}
                        />
                      );
                    }}
                    aria-label="Change Baker"
                    icon={<MdOutlineModeEdit />}
                    variant="circle"
                    mb={2}
                  />
                  <IconButton
                    ml={2}
                    mr={2}
                    onClick={() => onClickUndelegate(delegation.sender)}
                    variant="circle"
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

const DelegationsView = () => {
  const delegationsOps = useAllDelegations();
  const { filterMap: filter, accountsFilter } = useAccountsFilterWithMapFilter();
  const delegationsArrays = objectMap(delegationsOps, d => (d ? [d] : undefined));
  const delegationsToDisplay = compact(filter(delegationsArrays).map(makeDelegation));
  const { openWith } = useContext(DynamicModalContext);
  //TODO: remove after undelegete is implemented
  const { modalElement, onOpen } = useSendFormModal();

  return (
    <Flex direction="column" height="100%">
      <TopBar title="Delegations" />
      <Flex alignItems="left" justifyContent="space-between">
        {accountsFilter}
        <IconAndTextBtn
          onClick={() => openWith(<DelegationFormPage />)}
          color={colors.green}
          icon={VscWand}
          label="Delegate"
        />
      </Flex>
      {delegationsToDisplay.length > 0 ? (
        <Box overflowY="auto">
          <DelegationsTable
            onClickUndelegate={sender =>
              onOpen({
                sender,
                mode: {
                  type: "delegation",
                  data: { undelegate: true },
                },
              })
            }
            delegations={delegationsToDisplay}
          />
        </Box>
      ) : (
        <NoDelegations onDelegate={() => openWith(<DelegationFormPage />)} />
      )}
      {modalElement}
    </Flex>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default DelegationsView;
