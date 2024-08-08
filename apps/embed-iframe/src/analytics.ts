import { type Network, type TypeOfLogin } from "@trilitech-umami/umami-embed/types";

import { getKeyForOrigin } from "./ClientsPermissions";

interface EventProps {
  eventName: GAEvent;
  params: Record<string, string | number | undefined>;
}

export enum GAEvent {
  OPEN_SOCIAL_LOGIN_MODAL = "open_social_login_modal",
  SOCIAL_LOGIN_BUTTON_CLICK = "social_login_button_click",
  SUCCESSFUL_CONNECTION = "successful_connection",
}

export const trackGAEvent = ({ eventName, params }: EventProps) => {
  (window as any).gtag("event", eventName, {
    ...params,
    surface: "embed",
  });
};

export const trackSocialLoginModalOpen = (
  network: Network,
  socialLoginOptions: TypeOfLogin[],
  dAppOrigin: string
) => {
  const dApp = getKeyForOrigin(dAppOrigin) ?? undefined;
  trackGAEvent({
    eventName: GAEvent.OPEN_SOCIAL_LOGIN_MODAL,
    params: {
      network: network,
      loginOptions: socialLoginOptions.join(","),
      dApp_origin: dAppOrigin,
      dApp,
    },
  });
};

export const trackSocialLoginButtonClick = (
  network: Network,
  TypeOfLogin: TypeOfLogin,
  dAppOrigin: string
) => {
  const dApp = getKeyForOrigin(dAppOrigin) ?? undefined;
  trackGAEvent({
    eventName: GAEvent.SOCIAL_LOGIN_BUTTON_CLICK,
    params: {
      network: network,
      login_type: TypeOfLogin,
      dApp_origin: dAppOrigin,
      dApp,
    },
  });
};

export const trackSuccessfulConnection = (
  network: Network,
  TypeOfLogin: TypeOfLogin,
  dAppOrigin: string
) => {
  const dApp = getKeyForOrigin(dAppOrigin) ?? undefined;
  trackGAEvent({
    eventName: GAEvent.SUCCESSFUL_CONNECTION,
    params: {
      network: network,
      connection_type: "social",
      login_type: TypeOfLogin,
      dApp_origin: dAppOrigin,
      dApp,
    },
  });
};
