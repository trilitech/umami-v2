import { type ButtonProps, IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { FacebookIcon } from "../../../assets/icons";

export const OnboardWithFacebookButton = ({
  onAuth,
  ...props
}: { onAuth?: () => void } & ButtonProps) => {
  const { isLoading, onboard } = useOnboardWithSocial("facebook", onAuth);

  return (
    <IconButton
      boxSize="full"
      aria-label="Facebook SSO"
      data-testid="login-button-facebook"
      icon={<FacebookIcon width="60px" height="60px" />}
      isLoading={isLoading}
      onClick={onboard}
      variant="socialLogin"
      {...props}
    />
  );
};
