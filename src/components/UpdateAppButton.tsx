import { Box, Button, Text } from "@chakra-ui/react";
import FlipForwardEnergy from "../assets/icons/FlipForwardEnergy";
import colors from "../style/colors";
import { useState, useEffect } from "react";

/**
 * Button component to allow users see and download app update when available.
 */
export const UpdateAppButton = () => {
  const [isAppUpdateAvailable, setIsAppUpdateAvailable] = useState(false);
  const internalWindows = window as any;

  // Listen to event from electron on having update available.
  useEffect(() => {
    if (internalWindows && internalWindows.electronAPI) {
      internalWindows.electronAPI.onAppUpdateDownloaded((_event: any) =>
        setIsAppUpdateAvailable(true)
      );
    }
  }, [internalWindows]);

  const startUpdate = () => {
    if (internalWindows && internalWindows.electronAPI) {
      // TODO: Show a toast "app update is started" before sending an event.
      internalWindows.electronAPI.installAppUpdateAndQuit();
    }
  };

  return isAppUpdateAvailable ? (
    <Box marginTop="24px" marginBottom="6px">
      <Button
        color={colors.black}
        background={colors.green}
        _hover={{
          color: colors.black,
          background: colors.greenL,
        }}
        width="100%"
        height="32px"
        paddingLeft="8px"
        paddingRight="8px"
        paddingTop="7px"
        paddingBottom="7px"
        justifyContent="flex-start"
        onClick={startUpdate}
      >
        <FlipForwardEnergy />
        <Text size="sm" marginLeft="4px">
          Update Umami
        </Text>
      </Button>
    </Box>
  ) : null;
};
