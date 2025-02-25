import { Box, Button, Flex, Heading, Icon } from "@chakra-ui/react";
import { type IDP } from "@umami/social-auth";
import { type SVGProps } from "react";

import { FacebookIcon, GoogleIcon, RedditIcon, TwitterIcon } from "../../assets/icons";
import { useOnboardWithSocial } from "../../components/Onboarding/OnboardOptions/useOnboardWithSocial";

type LoginType = Omit<IDP, "email" | "apple">;

type LoginButtonComponentProps = {
  idp: LoginType;
  prefix?: string;
};

export const LoginButtonComponent = ({ idp, prefix }: LoginButtonComponentProps) => {
  const { onboard } = useOnboardWithSocial(idp as IDP);

  return (
    <Button
      position="relative"
      width="100%"
      height="62px"
      padding="0px"
      border="none"
      borderRadius="100px"
      onClick={onboard}
    >
      <Box position="absolute" top="50%" left="12px" transform="translateY(-50%)">
        <LogoIconWithBackground idp={idp} />
      </Box>
      <Heading flex="1" lineHeight="18px" textAlign="center" size="lg">
        {prefix ? `${prefix} ${socialLabel(idp)}` : socialLabel(idp)}
      </Heading>
    </Button>
  );
};

const LogoIconWithBackground = ({ idp }: { idp: LoginType }) => (
  <Flex
    alignItems="center"
    justifyContent="center"
    width="36px"
    height="36px"
    background="black"
    borderRadius="50%"
    filter="drop-shadow(0px 0px 12px rgba(45, 55, 72, 0.08))"
  >
    <Icon
      as={LogoIcon}
      aria-label="Social login button"
      data-testid="login-button-social"
      idp={idp}
    />
  </Flex>
);

const LogoIcon = ({ idp, props }: { idp: LoginType; props: SVGProps<SVGSVGElement> }) => {
  switch (idp) {
    case "facebook":
      return <FacebookIcon {...props} />;
    case "google":
      return <GoogleIcon {...props} />;
    case "twitter":
      return <TwitterIcon {...props} />;
    case "reddit":
      return <RedditIcon {...props} />;
  }
};

const socialLabel = (idp: LoginType) => {
  switch (idp) {
    case "facebook":
      return "Facebook";
    case "google":
      return "Google";
    case "twitter":
      return "X";
    case "reddit":
      return "Reddit";
  }
};
