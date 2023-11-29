import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useAccountsFilter } from "../../components/useAccountsFilter";
import { NoOperations } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useGetOperations } from "./useGetOperations";
import { OperationTile, OperationTileContext } from "../../components/OperationTile";
import colors from "../../style/colors";
import { useEffect } from "react";

export const OperationsView = () => {
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
    <Text color={colors.gray[500]} textAlign="center" paddingY="20px">
      Loading...
    </Text>
  );

  return (
    <Flex flexDirection="column" height="100%" paddingX="6px">
      <TopBar title="Operations" />
      {accountsFilter}
      {operations.length === 0 && isLoading && loadingElement}
      {operations.length === 0 && !isLoading && <NoOperations />}
      {operations.length > 0 && (
        <Box
          overflowY="scroll"
          marginBottom="20px"
          background={colors.gray[900]}
          borderRadius="8px"
          onScroll={onScroll}
          paddingX="20px"
        >
          <OperationTileContext.Provider value={{ mode: "page" }}>
            {operations.map((operation, i) => {
              const isLast = i === operations.length - 1;
              return (
                <Box
                  key={operation.id}
                  height="90px"
                  marginBottom={isLast ? "10px" : 0}
                  paddingY="20px"
                >
                  <OperationTile operation={operation} />
                  {!isLast && (
                    <Box>
                      <Divider marginTop="20px" />
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
        </Box>
      )}
    </Flex>
  );
};
