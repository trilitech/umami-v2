import { IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { EnvelopeIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";

// eslint-disable-next-line import/no-unused-modules
export const OnboardWithEmailButton = ({ onAuth }: { onAuth: () => void }) => {
  const color = useColor();
  const { isLoading, onboard } = useOnboardWithSocial("email", onAuth);

  return (
    <IconButton
      color="black"
      _hover={{ color: "white", background: color("600") }}
      aria-label="Email SSO"
      data-testid="login-button-email"
      icon={<EnvelopeIcon />}
      isLoading={isLoading}
      onClick={onboard}
      variant="socialLogin"
    />
  );
};
