import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useAccountsFilter } from "../../components/useAccountsFilter";
import { NoOperations } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useGetOperations } from "./useGetOperations";
import { OperationTile, OperationTileContext } from "../../components/OperationTile";
import colors from "../../style/colors";
import { useEffect } from "react";

const OperationsView = () => {
  const { accountsFilter, selectedAccounts } = useAccountsFilter();
  const { operations, loadMore, hasMore, setAddresses, isLoading } = useGetOperations(
    selectedAccounts.map(acc => acc.address.pkh)
  );
  const addressesJoined = selectedAccounts.map(acc => acc.address.pkh).join(",");

  useEffect(() => {
    setAddresses(addressesJoined.split(",")); // TODO: check if could be managed inside the getOperations hook itself
  }, [setAddresses, addressesJoined]);
  const onScroll = async (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (!hasMore || isLoading) {
      return;
    }
    const element = e.target as HTMLDivElement;

    // start loading earlier than we reached the end of the list
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 100) {
      loadMore();
    }
  };

  const loadingElement = (
    <Text textAlign="center" color={colors.gray[500]} py="20px">
      Loading...
    </Text>
  );

  return (
    <Flex direction="column" height="100%" px="6px">
      <TopBar title="Operations" />
      {accountsFilter}
      <Box
        overflowY="scroll"
        onScroll={onScroll}
        borderRadius="8px"
        px="20px"
        mb="20px"
        bg={colors.gray[900]}
      >
        {operations.length === 0 && isLoading && loadingElement}
        {operations.length === 0 && !isLoading && <NoOperations />}
        {operations.length > 0 && (
          <OperationTileContext.Provider value={{ mode: "page" }}>
            {operations.map((operation, i) => {
              const isLast = i === operations.length - 1;
              return (
                <Box key={operation.id} height="90px" mb={isLast ? "10px" : 0} py="20px">
                  <OperationTile operation={operation} />
                  {!isLast && (
                    <Box>
                      <Divider mt="20px" />
                    </Box>
                  )}
                </Box>
              );
            })}
            {isLoading && (
              <>
                <Divider />
                {loadingElement}
              </>
            )}
          </OperationTileContext.Provider>
        )}
      </Box>
    </Flex>
  );
};

export default OperationsView;
