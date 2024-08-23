import { type ButtonProps, IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { RedditIcon } from "../../assets/icons";

export const OnboardWithRedditButton = ({
  onAuth,
  ...props
}: { onAuth?: () => void } & ButtonProps) => {
  const { isLoading, onboard } = useOnboardWithSocial("reddit", onAuth);

  return (
    <IconButton
      aria-label="Reddit SSO"
      data-testid="login-button-reddit"
      icon={<RedditIcon />}
      isLoading={isLoading}
      onClick={onboard}
      variant="socialLogin"
      {...props}
    />
  );
};
