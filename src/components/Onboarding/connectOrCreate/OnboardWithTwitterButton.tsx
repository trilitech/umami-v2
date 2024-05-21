import { IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { TwitterIcon } from "../../../assets/icons";
import colors from "../../../style/colors";

export const OnboardWithTwitterButton = ({ onAuth }: { onAuth: () => void }) => {
  const { isLoading, onboard } = useOnboardWithSocial("twitter", onAuth);

  return (
    <IconButton
      color="black"
      _hover={{ color: "white", background: colors.gray[600] }}
      aria-label="Twitter SSO"
      data-testid="login-button-twitter"
      icon={<TwitterIcon fill="currentColor" />}
      isLoading={isLoading}
      onClick={onboard}
      variant="socialLogin"
    />
  );
};
