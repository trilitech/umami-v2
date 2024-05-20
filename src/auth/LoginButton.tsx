import { IconButton } from "@chakra-ui/react";
import { minutesToMilliseconds } from "date-fns";

import { EnvelopeIcon, GoogleIcon, RedditIcon } from "../assets/icons";
import colors from "../style/colors";
import { useAsyncActionHandler } from "../utils/hooks/useAsyncActionHandler";
import { withTimeout } from "../utils/withTimeout";

import { Auth, IDP } from ".";

const LOGIN_TIMEOUT = minutesToMilliseconds(1);

/**
 * Component that's used for onboarding users with Google SSO.
 * It's used on the onboarding page.
 * It opens a popup window with Google SSO on a click.
 *
 * @param onAuth - callback function which is called with the secret key and email of the user
 *                 on a successful authentication
 */
export const LoginButton: React.FC<{
  idp: IDP;
  onAuth: ({ secretKey, name }: { secretKey: string; name: string }) => void;
}> = ({ idp, onAuth }) => {
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const onClick = () =>
    handleAsyncAction(
      () => withTimeout(() => Auth.for(idp).getCredentials().then(onAuth), LOGIN_TIMEOUT),
      { title: "Social login failed" }
    );

  switch (idp) {
    case "google":
      return <GoogleButton isLoading={isLoading} onClick={onClick} />;
    case "email":
      return <EmailButton isLoading={isLoading} onClick={onClick} />;
    case "reddit":
      return <RedditButton isLoading={isLoading} onClick={onClick} />;
  }
};

const GoogleButton: React.FC<{ isLoading: boolean; onClick: () => void }> = ({
  isLoading,
  onClick,
}) => (
  <IconButton
    width="48px"
    background="white"
    borderRadius="full"
    _disabled={{ bg: colors.gray[900] }}
    aria-label="Google SSO"
    data-testid="login-button-google"
    icon={<GoogleIcon />}
    isLoading={isLoading}
    onClick={onClick}
    size="lg"
    variant="outline"
  />
);

const EmailButton: React.FC<{ isLoading: boolean; onClick: () => void }> = ({
  isLoading,
  onClick,
}) => (
  <IconButton
    width="48px"
    background="white"
    borderRadius="full"
    _disabled={{ bg: colors.gray[900] }}
    aria-label="Email SSO"
    data-testid="login-button-email"
    icon={<EnvelopeIcon />}
    isLoading={isLoading}
    onClick={onClick}
    size="lg"
    variant="outline"
  />
);

const RedditButton: React.FC<{ isLoading: boolean; onClick: () => void }> = ({
  isLoading,
  onClick,
}) => (
  <IconButton
    width="48px"
    background="white"
    borderRadius="full"
    _disabled={{ bg: colors.gray[900] }}
    aria-label="Reddit SSO"
    data-testid="login-button-reddit"
    icon={<RedditIcon />}
    isLoading={isLoading}
    onClick={onClick}
    size="lg"
    variant="outline"
  />
);
