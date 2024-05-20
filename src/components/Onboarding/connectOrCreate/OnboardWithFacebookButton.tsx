import { IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { FacebookIcon } from "../../../assets/icons";
import colors from "../../../style/colors";

export const OnboardWithFacebookButton = ({ onAuth }: { onAuth: () => void }) => {
  const { isLoading, onboard } = useOnboardWithSocial("facebook", onAuth);

  return (
    <IconButton
      width="48px"
      background="white"
      borderRadius="full"
      _disabled={{ bg: colors.gray[900] }}
      aria-label="Facebook SSO"
      data-testid="login-button-facebook"
      icon={<FacebookIcon />}
      isLoading={isLoading}
      onClick={onboard}
      size="lg"
      variant="outline"
    />
  );
};
