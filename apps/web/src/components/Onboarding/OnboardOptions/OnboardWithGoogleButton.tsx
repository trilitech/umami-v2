import { type ButtonProps, IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { GoogleIcon } from "../../../assets/icons";

export const OnboardWithGoogleButton = ({
  onAuth,
  ...props
}: { onAuth?: () => void } & ButtonProps) => {
  const { isLoading, onboard } = useOnboardWithSocial("google", onAuth);

  return (
    <IconButton
      aria-label="Google SSO"
      data-testid="login-button-google"
      icon={<GoogleIcon />}
      isLoading={isLoading}
      onClick={onboard}
      variant="socialLogin"
      {...props}
    />
  );
};
