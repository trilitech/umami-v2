import { Box, Button, Divider, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import React, { useEffect, useState } from "react";
import FetchingIcon from "../assets/icons/Fetching";
import colors from "../style/colors";
import { useIsLoading, useLastTimeUpdated } from "../utils/hooks/assetsHooks";
import { useAppDispatch } from "../utils/redux/hooks";
import { assetsActions } from "../utils/redux/slices/assetsSlice";
import SendButton from "../views/home/SendButton";
import useBuyTezModal from "./BuyTez/useBuyTezModal";

const emailBodyTemplate =
  "What do you like?%0A%0A What do you not like?%0A%0A Which functionality is missing?%0A%0A Did you experience any errors?";

const formatRelativeTimestamp = (timestamp: string) => {
  return formatDistance(new Date(timestamp), new Date());
};

const UpdateButton = () => {
  const dispatch = useAppDispatch();
  const isLoading = useIsLoading();
  const lastTimeUpdated = useLastTimeUpdated();

  const [relativeTimestamp, setRelativeTimestamp] = useState<string | null>(
    lastTimeUpdated && formatRelativeTimestamp(lastTimeUpdated)
  );

  useEffect(() => {
    if (lastTimeUpdated) {
      const interval = setInterval(() => {
        setRelativeTimestamp(formatRelativeTimestamp(lastTimeUpdated));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lastTimeUpdated]);

  const onClick = () => {
    dispatch(assetsActions.refetch());
  };

  return (
    <>
      {relativeTimestamp && (
        <Text size="sm" color={colors.gray[400]} display="inline">
          Last updated: {relativeTimestamp} ago
        </Text>
      )}
      <IconButton
        ml={2}
        mr={8}
        width="48px"
        borderRadius="50%"
        aria-label="refetch"
        icon={<FetchingIcon />}
        onClick={onClick}
        isLoading={isLoading}
      />
    </>
  );
};

export const TopBar: React.FC<{ title: string }> = ({ title }) => {
  const { modalElement, onOpen } = useBuyTezModal();
  return (
    <Box>
      <Flex h={24} justifyContent="space-between" alignItems="center">
        <Heading size="xl">{title}</Heading>
        <Box>
          <UpdateButton />
          <Button
            variant="tertiary"
            onClick={() => {
              window.open(
                `mailto:umami-support@trili.tech?subject=Umami V2 feedback&body=${emailBodyTemplate}`
              );
            }}
            mr={4}
          >
            Share Feedback
          </Button>
          <Button variant="tertiary" onClick={onOpen}>
            Buy Tez
          </Button>
          <SendButton />
        </Box>
        {modalElement}
      </Flex>
      <Divider />
    </Box>
  );
};
