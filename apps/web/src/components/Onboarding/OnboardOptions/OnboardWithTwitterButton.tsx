import { type ButtonProps, IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { TwitterIcon } from "../../../assets/icons";

export const OnboardWithTwitterButton = ({
  onAuth,
  ...props
}: { onAuth?: () => void } & ButtonProps) => {
  const { isLoading, onboard } = useOnboardWithSocial("twitter", onAuth);

  return (
    <IconButton
      boxSize="full"
      color="black"
      aria-label="Twitter SSO"
      data-testid="login-button-twitter"
      icon={<TwitterIcon width="24px" height="22px" fill="currentColor" />}
      isLoading={isLoading}
      onClick={onboard}
      variant="socialLogin"
      {...props}
    />
  );
};
