import { Box, Divider, Flex } from "@chakra-ui/react";
import { useAccountsFilterWithMapFilter } from "../../components/useAccountsFilter";
import { NoOperations } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useGetOperations } from "./useGetOperations";
import { OperationTile } from "../../components/OperationTile";
import colors from "../../style/colors";

const OperationsView = () => {
  // TODO: make this work
  const { filterMap: filter, accountsFilter } = useAccountsFilterWithMapFilter();
  const { operations } = useGetOperations();

  return (
    <Flex direction="column" height="100%" px="6px">
      <TopBar title="Operations" />
      {accountsFilter}
      <Box overflowY="scroll" borderRadius="8px" p="20px" bg={colors.gray[900]}>
        {operations.length === 0 ? (
          <NoOperations />
        ) : (
          operations.map(operation => (
            <Box key={operation.id} height="90px">
              <OperationTile operation={operation} />
              <Divider mt="20px" />
            </Box>
          ))
        )}
      </Box>
    </Flex>
  );
};

export default OperationsView;
