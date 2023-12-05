import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import React, { useContext, useEffect, useState } from "react";

import { BuyTezForm } from "./BuyTez/BuyTezForm";
import { DynamicModalContext } from "./DynamicModal";
import { FormPage as SendTezForm } from "./SendFlow/Tez/FormPage";
import { FetchingIcon } from "../assets/icons";
import colors from "../style/colors";
import { useIsLoading, useLastTimeUpdated } from "../utils/hooks/assetsHooks";
import { useAppDispatch } from "../utils/redux/hooks";
import { assetsActions } from "../utils/redux/slices/assetsSlice";

export const emailBodyTemplate =
  "What is it about? (if a bug report please consider including your account address) %0A PLEASE FILL %0A%0A What is the feedback? %0A PLEASE FILL";

const formatRelativeTimestamp = (timestamp: string) => {
  return formatDistance(new Date(timestamp), new Date());
};

const UpdateButton = () => {
  const [isSmallSize] = useMediaQuery("(max-width: 1200px)");

  const dispatch = useAppDispatch();
  const isLoading = useIsLoading();
  const lastTimeUpdated = useLastTimeUpdated();

  const onClick = () => {
    dispatch(assetsActions.refetch());
  };

  return (
    <>
      {lastTimeUpdated && !isSmallSize && (
        <Text display="inline" color={colors.gray[400]} size="sm">
          Updated {formatRelativeTimestamp(lastTimeUpdated)} ago
        </Text>
      )}
      <IconButton
        marginRight="36px"
        marginLeft="8px"
        _active={{ color: "white", bg: colors.green }}
        aria-label="refetch"
        data-testid="refetch-button"
        icon={<FetchingIcon />}
        isLoading={isLoading}
        onClick={onClick}
        variant="circle"
      />
    </>
  );
};

export const TopBar: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const { openWith } = useContext(DynamicModalContext);
  const [isSmallSize] = useMediaQuery("(max-width: 1200px)");

  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" height="88px">
        <Flex alignItems="end">
          <Heading marginRight="6px" size="xl">
            {title}
          </Heading>
          <Text color={colors.gray[450]} data-testid="nft-total-amount" size="xs">
            {subtitle}
          </Text>
        </Flex>
        <Box>
          <UpdateButton />
          {!isSmallSize && (
            <a
              href={`mailto:umami-support@trili.tech?subject=Umami V2 feedback&body=${emailBodyTemplate}`}
            >
              <Button marginRight={4} variant="tertiary">
                Share Feedback
              </Button>
            </a>
          )}
          <Button onClick={() => openWith(<BuyTezForm />)} variant="tertiary">
            Buy Tez
          </Button>
          <Button marginLeft={4} onClick={() => openWith(<SendTezForm />)}>
            Send
          </Button>
        </Box>
      </Flex>
      <Divider />
    </Box>
  );
};
