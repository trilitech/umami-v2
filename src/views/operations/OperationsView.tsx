import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useRef } from "react";

import { useGetOperations } from "./useGetOperations";
import { NoOperations } from "../../components/NoItems";
import { OperationTile, OperationTileContext } from "../../components/OperationTile";
import { TopBar } from "../../components/TopBar";
import { useAccountsFilter } from "../../components/useAccountsFilter";
import colors from "../../style/colors";

export const OperationsView = () => {
  const { accountsFilter, selectedAccounts } = useAccountsFilter();
  const { operations, loadMore, hasMore, isLoading, isFirstLoad } =
    useGetOperations(selectedAccounts);
  // used to run loadMore only once when the user scrolls to the bottom
  // otherwise it might be called multiple times which would trigger multiple fetches
  const skipLoadMore = useRef<boolean>(false);

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (skipLoadMore.current || !hasMore || isLoading) {
      return;
    }
    const element = e.target as HTMLDivElement;

    // start loading earlier than we reached the end of the list
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 100) {
      skipLoadMore.current = true;
      return loadMore().finally(() => {
        skipLoadMore.current = false;
      });
    }
  };

  const loadingElement = (
    <Text color={colors.gray[500]} textAlign="center" paddingY="20px">
      Loading...
    </Text>
  );

  return (
    <Flex flexDirection="column" height="100%">
      <TopBar title="Operations" />
      {accountsFilter}
      {isLoading && isFirstLoad && loadingElement}
      {operations.length === 0 && !isLoading && <NoOperations size="lg" />}
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
