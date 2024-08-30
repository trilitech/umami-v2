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
      aria-label="Facebook SSO"
      data-testid="login-button-facebook"
      icon={<FacebookIcon />}
      isLoading={isLoading}
      onClick={onboard}
      variant="socialLogin"
      {...props}
    />
  );
};
