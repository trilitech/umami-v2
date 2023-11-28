import { Box, Button, Text } from "@chakra-ui/react";
import FlipForwardEnergy from "../assets/icons/FlipForwardEnergy";
import colors from "../style/colors";

/**
 * Button component to allow users see and download app update when available.
 */
export const UpdateAppButton = () => {
  const startUpdate = () => {
    // TODO: send event to call autoUpdater.quitAndInstall() in electron
  };

  // TODO: listen to event from electron on having update available.
  // If no update available, return null.
  return (
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
  );
};
