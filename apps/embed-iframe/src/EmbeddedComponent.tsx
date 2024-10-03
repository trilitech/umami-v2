import { Box, useColorMode } from "@chakra-ui/react";
import {
  type Network,
  type RequestMessage,
  type RequestType,
  toMatchingResponseType,
  UmamiIframeConfig,
} from "@trilitech-umami/umami-embed";
import { useEffect } from "react";

import { getPermissionsForOrigin } from "./ClientsPermissions";
import { useLoginModal } from "./loginModalHooks";
import { useOperationModal } from "./operationModalHooks";
import { sendResponse } from "./utils";
import "./EmbeddedComponent.scss";
import { useEmbedApp } from "./EmbedAppContext";
import { useSignPayloadModal } from "./signPayloadModalHooks";
import { ENVIRONMENT } from "./env";

export function EmbeddedComponent() {
  const { getNetwork, getUserData, setNetwork, setUserData, setLoginOptions, setDAppOrigin } =
    useEmbedApp();
  const { setColorMode } = useColorMode();

  const { onOpen: openLoginModal, modalElement: loginModalElement } = useLoginModal();
  const { onOpen: openOperationModal, modalElement: operationModalElement } = useOperationModal();
  const { onOpen: openSignPayloadModal, modalElement: signPayloadModalElement } =
    useSignPayloadModal();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (window.addEventListener) {
      window.addEventListener("message", handleRequest, false);
    } else if ((window as any).attachEvent) {
      // fallback for older browsers (IE8 and below)
      (window as any).attachEvent("onmessage", handleRequest);
    } else {
      throw new Error("Umami-embed does not support this browser");
    }

    if (getUserData() !== null) {
      sendResponse({ type: "init_complete", userData: getUserData()! });
    } else {
      sendResponse({ type: "init_complete" });
    }

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (window.removeEventListener) {
        window.removeEventListener("message", handleRequest, false);
      } else if ((window as any).detachEvent) {
        // fallback for older browsers (IE8 and below)
        (window as any).detachEvent("onmessage", handleRequest);
      }
    };
  }, []);

  const handleRequest = (event: any) => {
    try {
      const data: RequestMessage = JSON.parse(event.data);

      console.log(`Received ${event.data} from ${event.origin}`);

      if (!validateClientPermissions(event.origin, data)) {
        return;
      }
      setDAppOrigin(event.origin);

      switch (data.type) {
        case "config_request":
          applyConfig(data.config);
          sendResponse({ type: "config_response" });
          break;
        case "login_request":
          if (getUserData() !== null) {
            sendResponse({
              type: "login_response",
              error: "user_already_logged_in",
              errorMessage: "UserData is already available",
            });
          } else {
            openLoginModal();
          }
          break;
        case "logout_request":
          setUserData(null);
          sendResponse({ type: "logout_response" });
          break;
        case "operation_request":
          if (validateUserSession(data.type)) {
            openOperationModal(data.operations);
          }
          break;
        case "sign_request":
          if (validateUserSession(data.type)) {
            openSignPayloadModal(data.signingType, data.payload);
          }
      }
    } catch {
      /* empty */
    }
  };

  const applyConfig = (config: UmamiIframeConfig) => {
    setNetwork(config.network);
    if (config.loginOptions) {
      if (config.loginOptions.length === 0) {
        sendResponse({
          type: "config_response",
          error: "empty_login_options",
          errorMessage: "Login options must include at least one login type value.",
        });
      }
      setLoginOptions(config.loginOptions);
      if (getUserData() !== null && !config.loginOptions.includes(getUserData()!.typeOfLogin)) {
        setUserData(null);
      }
    }
    setColorMode(config.theme ?? "light");
    // TODO: handle theme
    // TODO: handle logs level
  };

  const validateClientPermissions = (origin: string, request: RequestMessage): boolean => {
    if (request.type === "config_request") {
      return checkNetworkEnvironment(request.config.network, request.type);
    }
    if (getNetwork() === null) {
      sendResponse({
        type: toMatchingResponseType(request.type),
        error: "no_network_data",
        errorMessage: "Network data is not available. Try restarting the component.",
      });
      return false;
    }
    // ghostnet checks
    if (getNetwork() === "ghostnet") {
      return true;
    }
    // mainnet checks
    if (!checkNetworkEnvironment(getNetwork()!, request.type)) {
      return false;
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
      case "sign_request":
        if (!clientPermissions.signPayload) {
          sendResponse({
            type: toMatchingResponseType(request.type),
            error: "no_permissions",
            errorMessage: "No permissions found for sign actions",
          });
          return false;
        }
    }
    return true;
  };

  const validateUserSession = (requestType: RequestType): boolean => {
    if (getUserData() === null) {
      sendResponse({
        type: toMatchingResponseType(requestType),
        error: "no_login_data",
        errorMessage: "User's login data is not available. Please login first.",
      });
      return false;
    } else if (getNetwork() === null) {
      sendResponse({
        type: toMatchingResponseType(requestType),
        error: "no_network_data",
        errorMessage: "Network data is not available. Try restarting the component.",
      });
      return false;
    }
    return true;
  };

  const checkNetworkEnvironment = (network: Network, requestType: RequestType) => {
    if (network === "mainnet" && ENVIRONMENT !== "mainnet") {
      sendResponse({
        type: toMatchingResponseType(requestType),
        error: "invalid_network",
        errorMessage: "Mainnet is not supported in this environment",
      });
      return false;
    }
    return true;
  };

  return (
    <Box className="embedded-component">
      {loginModalElement}
      {operationModalElement}
      {signPayloadModalElement}
    </Box>
  );
}
