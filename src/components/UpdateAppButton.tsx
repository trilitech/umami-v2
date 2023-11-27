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
  );
};
