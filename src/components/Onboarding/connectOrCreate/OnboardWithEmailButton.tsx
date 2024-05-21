import { IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { EmailIcon } from "../../../assets/icons";
import colors from "../../../style/colors";

export const OnboardWithEmailButton = ({ onAuth }: { onAuth: () => void }) => {
  const { isLoading, onboard } = useOnboardWithSocial("email", onAuth);

  return (
    <IconButton
      color="black"
      _hover={{ color: "white", background: colors.gray[600] }}
      aria-label="Email SSO"
      data-testid="login-button-email"
      icon={<EmailIcon fill="currentColor" />}
      isLoading={isLoading}
      onClick={onboard}
      variant="socialLogin"
    />
  );
};
