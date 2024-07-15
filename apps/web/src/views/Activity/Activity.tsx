import { Box, Center, Divider, Flex, Image } from "@chakra-ui/react";
import { useGetOperations } from "@umami/data-polling";
import { useImplicitAccounts } from "@umami/state";
import { type UIEvent, useRef } from "react";

import loadingWheel from "../../assets/loading-wheel.gif";
import { EmptyMessage } from "../../components/EmptyMessage";
import { OperationTile } from "../../components/OperationTile";
import { useColor } from "../../styles/useColor";

export const Activity = () => {
  const color = useColor();
  const currentAccount = useImplicitAccounts()[0]; // TODO: add useCurrentAccount hook
  const { operations, loadMore, hasMore, isLoading, isFirstLoad } = useGetOperations([
    currentAccount,
  ]);

  // used to run loadMore only once when the user scrolls to the bottom
  // otherwise it might be called multiple times which would trigger multiple fetches
  const skipLoadMore = useRef<boolean>(false);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
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

  return (
    <Flex flexDirection="column" height="full">
      <Center display={isLoading && isFirstLoad ? "flex" : "none"} height="100%">
        <Image width="150px" height="75px" marginBottom="136px" src={loadingWheel} />
      </Center>

      {operations.length === 0 && !isLoading && (
        <EmptyMessage subtitle="activity" title="Activity" />
      )}
      {operations.length > 0 && (
        <Box background={color("white")} borderRadius="8px" onScroll={onScroll}>
          {operations.map((operation, i) => {
            const isFirst = i === 0;
            const isLast = i === operations.length - 1;

            return (
              <OperationTile
                key={operation.id}
                paddingTop={isFirst ? 0 : "24px"}
                paddingBottom={isLast ? 0 : "24px"}
                borderBottom={isLast ? "none" : "1px solid"}
                borderBottomColor={color("100")}
                operation={operation}
              />
            );
          })}
          <Center flexDirection="column" display={isLoading && !isFirstLoad ? "flex" : "none"}>
            <Divider />
            <Image width="100px" height="50px" src="./static/media/loading-dots.gif" />
          </Center>
        </Box>
      )}
    </Flex>
  );
};
