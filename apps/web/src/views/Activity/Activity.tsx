import { Box, Center, Divider, Flex, Image, Spinner } from "@chakra-ui/react";
import { type Account } from "@umami/core";
import { useGetOperations } from "@umami/data-polling";
import { useCurrentAccount } from "@umami/state";

import loadingDots from "../../assets/loading-dots.gif";
import { EmptyMessage } from "../../components/EmptyMessage";
import { VerifyMessage, useIsAccountVerified } from "../../components/Onboarding/VerificationFlow";
import { OperationTile } from "../../components/OperationTile";
import { ViewOverlay } from "../../components/ViewOverlay/ViewOverlay";
import { useColor } from "../../styles/useColor";

export const Activity = () => {
  const isVerified = useIsAccountVerified();

  const color = useColor();
  const currentAccount = useCurrentAccount();

  const { operations, isLoading, isFirstLoad, triggerRef } = useGetOperations(
    [currentAccount ?? ({} as Account)],
    isVerified
  );

  const buyTezUrl = `https://widget.wert.io/default/widget/?commodity=XTZ&address=${currentAccount?.address.pkh}&network=tezos&commodity_id=xtz.simple.tezos`;

  const isEmpty = operations.length === 0 && !isLoading;

  return (
    <>
      <Flex zIndex={1} flexDirection="column" flexGrow={1}>
        {isLoading && isFirstLoad && (
          <Center display="flex" height="100%" minHeight="136px">
            <Spinner />
          </Center>
        )}

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
          <Box borderRadius="8px">
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
            {/* trigger for loading more operations */}
            <Box ref={triggerRef} />
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
