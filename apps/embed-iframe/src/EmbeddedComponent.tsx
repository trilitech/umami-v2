import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import {
  Network,
  type RequestMessage,
  type UserData,
  toMatchingResponseType,
} from "@trilitech-umami/umami-embed/types";
import { useEffect, useState } from "react";

import { type Permissions, getPermissionsForOrigin } from "./ClientsPermissions";
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
  });

  useEffect(() => {
    const handleRequest = (event: any) => {
      try {
        const data: RequestMessage = JSON.parse(event.data);

        const clientPermissions = checkPermissions(event.origin, data);
        if (!clientPermissions) {
          return;
        }

        switch (data.type) {
          case "login_request":
            setSelectedNetwork(data.network);
            console.log("network is set");
            openLoginModal();
            break;
          case "logout_request":
            setSelectedNetwork(null);
            setUserData(null);
            sendResponse({ type: "logout_response" });
            break;
          case "operation_request":
            console.log(userData, selectedNetwork, data.operations);
            if (userData === null) {
              sendResponse({
                type: toMatchingResponseType(data.type),
                error: "no_login_data",
                errorMessage: "User's login data is not available",
              });
            } else if (selectedNetwork === null) {
              sendResponse({
                type: toMatchingResponseType(data.type),
                error: "no_network_data",
                errorMessage: "User's network data is not available",
              });
            } else {
              // TODO: wrap in try catch and send error response if any error occurs
              openOperationModal(userData!, selectedNetwork, data.operations);
            }
            break;
        }
      } catch {
        /* empty */
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (window.addEventListener) {
      window.addEventListener("message", handleRequest, false);
    } else {
      // fallback for older browsers (IE8 and below)
      (window as any).attachEvent("onmessage", handleRequest);
    }

    if (userData === null && selectedNetwork === null) {
      // TODO: send init_complete only when once
      sendResponse({ type: "init_complete" });
    }

    return () => window.removeEventListener("message", handleRequest);
  }, [userData, selectedNetwork, openLoginModal, openOperationModal]);

  const checkPermissions = (origin: string, request: RequestMessage): Permissions | null => {
    const network = request.type === "login_request" ? request.network : selectedNetwork;
    if (network === null) {
      sendResponse({
        type: toMatchingResponseType(request.type),
        error: "no_network_data",
        errorMessage: "User's network data is not available",
      });
    }

    const clientPermissions = getPermissionsForOrigin(origin, network!);
    if (!clientPermissions) {
      sendResponse({
        type: toMatchingResponseType(request.type),
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
            type: toMatchingResponseType(request.type),
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
            type: toMatchingResponseType(request.type),
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
