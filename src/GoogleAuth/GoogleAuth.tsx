import { IconButton } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

import { getGoogleCredentials } from "./getGoogleCredentials";
import colors from "../style/colors";
import { useAsyncActionHandler } from "../utils/hooks/useAsyncActionHandler";

/**
 * Component that's used for onboarding users with Google SSO.
 * It's used on the onboarding page.
 * It opens a popup window with Google SSO on a click.
 *
 * @param onAuth - callback function which is called with the secret key and email of the user
 *                 on a successful authentication
 */
export const GoogleAuth: React.FC<{ onAuth: (secretKey: string, email: string) => void }> = ({
  onAuth,
}) => {
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const onClick = async () =>
    handleAsyncAction(
      async () => {
        const { secretKey, email } = await getGoogleCredentials();
        return onAuth(secretKey, email);
      },
      {
        title: "Social login failed",
      }
    );

  return (
    <IconButton
      width="48px"
      background="white"
      borderRadius="full"
      _disabled={{ bg: colors.gray[900] }}
      aria-label="Google SSO"
      data-testid="google-auth-button"
      icon={<FcGoogle size="24px" />}
      isLoading={isLoading}
      onClick={onClick}
      size="lg"
      variant="outline"
    />
  );
};
