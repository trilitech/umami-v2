import { Box, Button, Divider, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import FetchingIcon from "../assets/icons/Fetching";
import colors from "../style/colors";
import { useIsLoading, useLastTimeUpdated } from "../utils/hooks/assetsHooks";
import { useAppDispatch } from "../utils/redux/hooks";
import { assetsActions } from "../utils/redux/slices/assetsSlice";
import useBuyTezModal from "./BuyTez/useBuyTezModal";
import { DynamicModalContext } from "./DynamicModal";
import SendTezForm from "./SendFlow/Tez/FormPage";

export const emailBodyTemplate =
  "What is it about? (if a bug report please consider including your account address) %0A PLEASE FILL %0A%0A What is the feedback? %0A PLEASE FILL";

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
        aria-label="refetch"
        icon={<FetchingIcon />}
        onClick={onClick}
        isLoading={isLoading}
        variant="circle"
        _active={{ color: "white", bg: colors.green }}
      />
    </>
  );
};

export const TopBar: React.FC<{ title: string }> = ({ title }) => {
  const { modalElement, onOpen } = useBuyTezModal();
  const { openWith } = useContext(DynamicModalContext);
  return (
    <Box>
      <Flex h={24} justifyContent="space-between" alignItems="center">
        <Heading size="xl">{title}</Heading>
        <Box>
          <UpdateButton />
          <a
            href={`mailto:umami-support@trili.tech?subject=Umami V2 feedback&body=${emailBodyTemplate}`}
          >
            <Button variant="tertiary" mr={4}>
              Share Feedback
            </Button>
          </a>
          <Button variant="tertiary" onClick={onOpen}>
            Buy Tez
          </Button>
          <Button ml={4} onClick={() => openWith(<SendTezForm />)}>
            Send
          </Button>
        </Box>
        {modalElement}
      </Flex>
      <Divider />
    </Box>
  );
};
