import { IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { GoogleIcon } from "../../../assets/icons";
import colors from "../../../style/colors";

export const OnboardWithGoogleButton = ({ onAuth }: { onAuth: () => void }) => {
  const { isLoading, onboard } = useOnboardWithSocial("google", onAuth);

  return (
    <IconButton
      width="48px"
      background="white"
      borderRadius="full"
      _disabled={{ bg: colors.gray[900] }}
      aria-label="Google SSO"
      data-testid="login-button-google"
      icon={<GoogleIcon />}
      isLoading={isLoading}
      onClick={onboard}
      size="lg"
      variant="outline"
    />
  );
};
