import { IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { EnvelopeIcon } from "../../../assets/icons";
import colors from "../../../style/colors";

export const OnboardWithEmailButton = ({ onAuth }: { onAuth: () => void }) => {
  const { isLoading, onboard } = useOnboardWithSocial("email", onAuth);

  return (
    <IconButton
      width="48px"
      background="white"
      borderRadius="full"
      _disabled={{ bg: colors.gray[900] }}
      aria-label="Email SSO"
      data-testid="login-button-email"
      icon={<EnvelopeIcon />}
      isLoading={isLoading}
      onClick={onboard}
      size="lg"
      variant="outline"
    />
  );
};
