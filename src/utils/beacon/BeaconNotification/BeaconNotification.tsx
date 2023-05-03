import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
} from "@airgap/beacon-wallet";
import { Box } from "@chakra-ui/react";
import React from "react";
import PermissionRequestPannel from "./PermissionRequestPannel";
import SignPayloadRequestPannel from "./SignPayloadRequestPannel";

export const BeaconNotification: React.FC<{
  message: BeaconRequestOutputMessage;
  onSuccess: () => void;
}> = ({ message, onSuccess }) => {
  switch (message.type) {
    case BeaconMessageType.PermissionRequest: {
      return (
        <PermissionRequestPannel request={message} onSuccess={onSuccess} />
      );
    }
    case BeaconMessageType.SignPayloadRequest: {
      return (
        <SignPayloadRequestPannel request={message} onSuccess={onSuccess} />
      );
    }

    default:
      return <Box>"unsupported request:" {message.type}</Box>;
  }
};
