import { IconButton } from "@chakra-ui/react";

import { useOnboardWithSocial } from "./useOnboardWithSocial";
import { RedditIcon } from "../../../assets/icons";
import colors from "../../../style/colors";

export const OnboardWithRedditButton = ({ onAuth }: { onAuth: () => void }) => {
  const { isLoading, onboard } = useOnboardWithSocial("reddit", onAuth);

  return (
    <IconButton
      width="48px"
      background="white"
      borderRadius="full"
      _disabled={{ bg: colors.gray[900] }}
      aria-label="Reddit SSO"
      data-testid="login-button-reddit"
      icon={<RedditIcon />}
      isLoading={isLoading}
      onClick={onboard}
      size="lg"
      variant="outline"
    />
  );
};
