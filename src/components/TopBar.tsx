import { Box, Button, Divider, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { differenceInSeconds } from "date-fns";
import React, { useEffect, useState } from "react";
import FetchingIcon from "../assets/icons/Fetching";
import colors from "../style/colors";
import { useIsLoading, useLastTimeUpdated } from "../utils/hooks/assetsHooks";
import { useAppDispatch } from "../utils/redux/hooks";
import { assetsActions } from "../utils/redux/slices/assetsSlice";
import SendButton from "../views/home/SendButton";
import useBuyTezModal from "./BuyTez/useBuyTezModal";

const UpdateButton = () => {
  const dispatch = useAppDispatch();
  const isLoading = useIsLoading();
  const lastTimeUpdated = useLastTimeUpdated();
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastTimeUpdated) {
        const seconds = differenceInSeconds(new Date(), new Date(lastTimeUpdated));
        setTimestamp(`${seconds} second(s) ago`);
      }
    });
    return () => clearInterval(interval);
  }, [lastTimeUpdated]);

  const onClick = () => {
    dispatch(assetsActions.refetch());
  };

  return (
    <>
      {/* TODO: use pluralize.js */}
      {timestamp && (
        <Text size="sm" color={colors.gray[400]} display="inline">
          {timestamp}
        </Text>
      )}
      <IconButton
        ml={2}
        mr={8}
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
          <Button variant="outline" onClick={onOpen}>
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
