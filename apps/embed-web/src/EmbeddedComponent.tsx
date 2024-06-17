import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { useEffect } from "react";

import { type Permissions, getPermissionsForOrigin } from "./ClientsPermissions";
import theme from "./imported/style/theme";
import { useLoginModal } from "./loginModalHooks";
import { useSignOperationModal } from "./signOperationModalHooks";
import { type RequestMessage, getMatchingType } from "./types";
import { sendResponse } from "./utils";
import "./EmbeddedComponent.scss";

export function EmbeddedComponent() {
  const { onOpen: openLoginModal, modalElement: loginModalElement } = useLoginModal();
  const { onOpen: openOperationModal, modalElement: operationModalElement } =
    useSignOperationModal();

  useEffect(() => {
    document.body.style.background = "none";

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (window.addEventListener) {
      window.addEventListener("message", handleRequest, false);
    } else {
      // fallback for older browsers (IE8 and below)
      (window as any).attachEvent("onmessage", handleRequest);
    }

    sendResponse({ type: "init_complete" });
  });

  const handleRequest = (event: any) => {
    try {
      const data: RequestMessage = JSON.parse(event.data);

      console.log(`Received ${event.data} from ${event.origin}`);
      console.log(data);

      const clientPermissions = checkPermissions(event.origin, data);
      if (!clientPermissions) {
        return;
      }

      switch (data.type) {
        case "login_request":
          // TODO: save selected network
          openLoginModal();
          break;
        case "logout_request":
          // TODO: delete user data
          sendResponse({ type: "logout_response" });
          break;
        case "operation_request":
          openOperationModal(data.operations);
          break;
      }
    } catch {
      /* empty */
    }
  };

  const checkPermissions = (origin: string, request: RequestMessage): Permissions | null => {
    const clientPermissions = getPermissionsForOrigin(origin);
    if (!clientPermissions) {
      console.error(`No permissions for origin (${origin})`);
      sendResponse({
        type: getMatchingType(request.type),
        error: "no_permissions",
        errorMessage: "No permissions found for given origin",
      });
      return null;
    }
    switch (request.type) {
      case "login_request":
      case "logout_request":
        if (!clientPermissions.login) {
          sendResponse({
            type: getMatchingType(request.type),
            error: "no_permissions",
            errorMessage: "No permissions found for login actions",
          });
          return null;
        }
        // TODO: check if desired network is allowed
        break;
      case "operation_request":
        if (!clientPermissions.operations) {
          sendResponse({
            type: getMatchingType(request.type),
            error: "no_permissions",
            errorMessage: "No permissions found for operation actions",
          });
          return null;
        }
        // TODO: check if desired operations are allowed
        break;
    }
    return clientPermissions;
  };

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box className="embedded-component">
        {loginModalElement}
        {operationModalElement}
      </Box>
    </ChakraProvider>
  );
}
