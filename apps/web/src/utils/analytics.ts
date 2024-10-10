import type * as Auth from "@umami/social-auth";

interface EventProps {
  eventName: GAEvent;
  params: Record<string, string | number | undefined>;
}

enum GAEvent {
  BUTTON_CLICK = "button_click",
  CONNECT_SUCCESS = "connect_success",
}

const trackGAEvent = ({ eventName, params }: EventProps) => {
  (window as any).gtag("event", eventName, {
    ...params,
    surface: "web",
  });
};

export const trackSocialLoginButtonClick = (section: string, idp: Auth.IDP) => {
  trackGAEvent({
    eventName: GAEvent.BUTTON_CLICK,
    params: {
      section,
      action: "social_login",
      idp,
    },
  });
};

export const trackButtonClick = (section: string, action: string) => {
  trackGAEvent({
    eventName: GAEvent.BUTTON_CLICK,
    params: {
      section,
      action,
    },
  });
};

export const trackSuccessfulConnection = (section: string, connectionType: string) => {
  trackGAEvent({
    eventName: GAEvent.CONNECT_SUCCESS,
    params: {
      section,
      connectionType,
    },
  });
};

export const trackSuccessfulSocialConnection = (section: string, idp: Auth.IDP) => {
  trackGAEvent({
    eventName: GAEvent.CONNECT_SUCCESS,
    params: {
      section,
      connectionType: "social",
      idp,
    },
  });
};
