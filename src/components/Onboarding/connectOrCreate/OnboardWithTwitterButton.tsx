import { IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { TwitterIcon } from "../../../assets/icons";
import colors from "../../../style/colors";

export const OnboardWithTwitterButton = ({ onAuth }: { onAuth: () => void }) => {
  const { isLoading, onboard } = useOnboardWithSocial("twitter", onAuth);

  return (
    <IconButton
      width="48px"
      background="white"
      borderRadius="full"
      _disabled={{ bg: colors.gray[900] }}
      aria-label="Twitter SSO"
      data-testid="login-button-twitter"
      icon={<TwitterIcon />}
      isLoading={isLoading}
      onClick={onboard}
      size="lg"
      variant="outline"
    />
  );
};
