import { useState, useEffect } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { FlipForwardEnergy } from "../assets/icons";
import colors from "../style/colors";

/**
 * Button component to allow users see and download app update when available.
 */
export const UpdateAppButton = () => {
  const [isAppUpdateAvailable, setIsAppUpdateAvailable] = useState(false);
  const appWindow = window as any;

  // Listen to event from electron on having update available.
  useEffect(() => {
    if (appWindow && appWindow.electronAPI) {
      appWindow.electronAPI.onAppUpdateDownloaded((_event: any) => setIsAppUpdateAvailable(true));
    }
  }, [appWindow]);

  const startUpdate = () => {
    if (appWindow && appWindow.electronAPI) {
      appWindow.electronAPI.installAppUpdateAndQuit();
    }
  };

  return isAppUpdateAvailable ? (
    <Box marginTop="24px" marginBottom="6px">
      <Button
        justifyContent="flex-start"
        width="100%"
        height="32px"
        paddingTop="7px"
        paddingRight="8px"
        paddingBottom="7px"
        paddingLeft="8px"
        color={colors.black}
        background={colors.green}
        _hover={{
          color: colors.black,
          background: colors.greenL,
        }}
        onClick={startUpdate}
      >
        <FlipForwardEnergy />
        <Text marginLeft="4px" size="sm">
          Update Umami
        </Text>
      </Button>
    </Box>
  ) : null;
};
