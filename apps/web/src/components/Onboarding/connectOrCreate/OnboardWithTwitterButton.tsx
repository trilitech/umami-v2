import { IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { TwitterIcon } from "../../../assets/icons";

export const OnboardWithTwitterButton = ({ onAuth }: { onAuth: () => void }) => {
  const { isLoading, onboard } = useOnboardWithSocial("twitter", onAuth);

  return (
    <IconButton
      color="black"
      aria-label="Twitter SSO"
      data-testid="login-button-twitter"
      icon={<TwitterIcon fill="currentColor" />}
      isLoading={isLoading}
      onClick={onboard}
      variant="socialLogin"
    />
  );
};
