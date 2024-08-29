import { Box, Center, Divider, Flex, Image } from "@chakra-ui/react";
import { useGetOperations } from "@umami/data-polling";
import { useCurrentAccount } from "@umami/state";
import { type UIEvent, useRef } from "react";

import loadingDots from "../../assets/loading-dots.gif";
import loadingWheel from "../../assets/loading-wheel.gif";
import { EmptyMessage, VerifyMessage } from "../../components/EmptyMessage";
import { useCheckVerified } from "../../components/Onboarding/useCheckUnverified";
import { OperationTile } from "../../components/OperationTile";
import { ViewOverlay } from "../../components/ViewOverlay/ViewOverlay";
import { useColor } from "../../styles/useColor";

export const Activity = () => {
  const isVerified = useCheckVerified();

  const color = useColor();
  const currentAccount = useCurrentAccount()!;
  const { operations, loadMore, hasMore, isLoading, isFirstLoad } = useGetOperations([
    currentAccount,
  ]);

  const buyTezUrl = `https://widget.wert.io/default/widget/?commodity=XTZ&address=${currentAccount.address.pkh}&network=tezos&commodity_id=xtz.simple.tezos`;

  // used to run loadMore only once when the user scrolls to the bottom
  // otherwise it might be called multiple times which would trigger multiple fetches
  const skipLoadMore = useRef<boolean>(false);

  const isEmpty = operations.length === 0 && !isLoading;

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
    <>
      <Flex zIndex={1} flexDirection="column" flexGrow={1}>
        <Center display={isLoading && isFirstLoad ? "flex" : "none"} height="100%">
          <Image width="150px" height="75px" marginBottom="136px" src={loadingWheel} />
        </Center>

        {isVerified ? (
          isEmpty && (
            <EmptyMessage
              margin="auto"
              cta="Buy Tez Now"
              ctaUrl={buyTezUrl}
              subtitle={"You need Tez to take part in any activity.\n Buy some to get started."}
              title="Welcome to Your Web3 Wallet"
            />
          )
        ) : (
          <VerifyMessage />
        )}
        {operations.length > 0 && (
          <Box borderRadius="8px" onScroll={onScroll}>
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
              <Image width="100px" height="50px" src={loadingDots} />
            </Center>
          </Box>
        )}
      </Flex>
      {isEmpty && <ViewOverlay iconType="activity" />}
    </>
  );
};
