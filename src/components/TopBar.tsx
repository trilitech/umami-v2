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
import { differenceInMinutes, differenceInSeconds, formatDistance } from "date-fns";
import React, { useContext, useEffect, useState } from "react";

import { BuyTezForm } from "./BuyTez/BuyTezForm";
import { DynamicModalContext } from "./DynamicModal";
import { FormPage as SendTezForm } from "./SendFlow/Tez/FormPage";
import { FetchingIcon } from "../assets/icons";
import { CheckIcon } from "../assets/icons/CheckIcon";
import colors from "../style/colors";
import { useIsLoading, useLastTimeUpdated } from "../utils/hooks/assetsHooks";
import { useAppDispatch } from "../utils/redux/hooks";
import { assetsActions } from "../utils/redux/slices/assetsSlice";

const UpdateButton = () => {
  const dispatch = useAppDispatch();
  const isLoading = useIsLoading();
  const lastTimeUpdated = useLastTimeUpdated();
  const [changeOpacity, setChangeOpacity] = useState(false);
  const [showUpdatedJustNow, setShowUpdatedJustNow] = useState(false);
  const [isSmallSize] = useMediaQuery("(max-width: 1200px)");

  useEffect(() => {
    if (!lastTimeUpdated) {
      return;
    }
    // show updated just now only if it's been no more than 1 second since the last update
    // otherwise, it'll show the same message on each re-render
    if (differenceInSeconds(new Date(), new Date(lastTimeUpdated)) > 1) {
      return;
    }

    setChangeOpacity(true);
    setShowUpdatedJustNow(true);

    const checkIcon = setTimeout(() => setChangeOpacity(false), 2000);
    const updateJustNow = setTimeout(() => setShowUpdatedJustNow(false), 3500);

    return () => {
      clearTimeout(checkIcon);
      clearTimeout(updateJustNow);
    };
  }, [lastTimeUpdated]);

  if (isSmallSize || lastTimeUpdated === null) {
    return null;
  }

  const onClick = () => {
    dispatch(assetsActions.refetch());
  };

  const showLastTimeUpdated = differenceInMinutes(new Date(), new Date(lastTimeUpdated)) >= 2;
  const transition = { opacity: changeOpacity ? 1 : 0, transition: "opacity 2s ease-in-out" };

  return (
    <>
      <Text
        display="inline"
        color={colors.gray[400]}
        size="sm"
        style={showUpdatedJustNow ? transition : undefined}
      >
        {showUpdatedJustNow && "Updated just now"}
        {showLastTimeUpdated &&
          `Updated ${formatDistance(new Date(lastTimeUpdated), new Date())} ago`}
      </Text>
      <IconButton
        marginRight="36px"
        marginLeft="8px"
        _active={{ color: "white", bg: colors.green }}
        aria-label="refetch"
        backgroundColor={showUpdatedJustNow ? colors.green : colors.gray[500]}
        data-testid="refetch-button"
        icon={
          showUpdatedJustNow ? <CheckIcon style={transition} /> : <FetchingIcon color="white" />
        }
        isLoading={isLoading}
        onClick={onClick}
        variant="circle_without_hover_color"
      />
    </>
  );
};

export const TopBar: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const { openWith } = useContext(DynamicModalContext);

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
