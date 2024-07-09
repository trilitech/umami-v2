import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import {
  type Network,
  type RequestMessage,
  type RequestType,
  type UserData,
  toMatchingResponseType,
} from "@trilitech-umami/umami-embed/types";
import { useEffect, useState } from "react";

import { getPermissionsForOrigin } from "./ClientsPermissions";
import theme from "./imported/style/theme";
import { useLoginModal } from "./loginModalHooks";
import { useSignOperationModal } from "./signOperationModalHooks";
import { sendResponse } from "./utils";
import "./EmbeddedComponent.scss";

export function EmbeddedComponent() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const onLoginCallback = (userData: UserData) => setUserData(userData);

  const { onOpen: openLoginModal, modalElement: loginModalElement } =
    useLoginModal(onLoginCallback);
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

      if (!validateClientPermissions(event.origin, data)) {
        return;
      }

      switch (data.type) {
        case "login_request":
          setSelectedNetwork(data.network);
          openLoginModal();
          break;
        case "logout_request":
          setSelectedNetwork(null);
          setUserData(null);
          sendResponse({ type: "logout_response" });
          break;
        case "operation_request":
          if (validateUserSession(data.type)) {
            openOperationModal(userData!, selectedNetwork!, data.operations);
          }
          break;
      }
    } catch {
      /* empty */
    }
  };

  const validateClientPermissions = (origin: string, request: RequestMessage): boolean => {
    const network = request.type === "login_request" ? request.network : selectedNetwork;
    if (network === null) {
      sendResponse({
        type: toMatchingResponseType(request.type),
        error: "no_network_data",
        errorMessage: "User's network data is not available",
      });
      return false;
    }
    if (network === "ghostnet") {
      return true;
    }

    const clientPermissions = getPermissionsForOrigin(origin);
    if (!clientPermissions) {
      console.error(`No permissions for origin (${origin})`);
      sendResponse({
        type: toMatchingResponseType(request.type),
        error: "no_permissions",
        errorMessage: "No permissions found for given origin",
      });
      return false;
    }
    switch (request.type) {
      case "login_request":
      case "logout_request":
        if (!clientPermissions.login) {
          sendResponse({
            type: toMatchingResponseType(request.type),
            error: "no_permissions",
            errorMessage: "No permissions found for login actions",
          });
          return false;
        }
        break;
      case "operation_request":
        if (!clientPermissions.operations) {
          sendResponse({
            type: toMatchingResponseType(request.type),
            error: "no_permissions",
            errorMessage: "No permissions found for operation actions",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const validateUserSession = (requestType: RequestType): boolean => {
    if (userData === null) {
      sendResponse({
        type: toMatchingResponseType(requestType),
        error: "no_login_data",
        errorMessage: "User's login data is not available",
      });
      return false;
    } else if (selectedNetwork === null) {
      sendResponse({
        type: toMatchingResponseType(requestType),
        error: "no_network_data",
        errorMessage: "User's network data is not available",
      });
      return false;
    }
    return true;
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
