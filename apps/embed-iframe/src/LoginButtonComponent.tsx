import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { type TypeOfLogin } from "@trilitech-umami/umami-embed";

import { FacebookLogoIcon, GoogleLogoIcon, RedditLogoIcon, TwitterLogoIcon } from "./assets/icons";

export const LoginButtonComponent = ({
  onClick,
  loginType,
  prefix,
}: {
  onClick: () => void;
  loginType: TypeOfLogin;
  prefix?: string;
}) => (
  <Button
    position="relative"
    width="100%"
    onClick={onClick}
    size="lg"
    borderRadius="36px"
    padding="0px"
  >
    <Box position="absolute" left="0px" top="50%" transform="translateY(-50%)">
      <LogoIconWithBackground loginType={loginType} />
    </Box>
    <Heading textAlign="center" flex="1" fontSize="14px" lineHeight="18px">
      {prefix ? `${prefix} ${socialLabel(loginType)}` : socialLabel(loginType)}
    </Heading>
  </Button>
);

const LogoIconWithBackground = ({ loginType }: { loginType: TypeOfLogin }) => (
  <Flex
    alignItems="center"
    justifyContent="center"
    width="36px"
    height="36px"
    borderRadius="50%"
    backgroundColor="white"
    margin="6px"
    shadow="0px 0px 12px 1px rgba(45, 55, 72, 0.08)"
  >
    <LogoIcon loginType={loginType} />
  </Flex>
);

const LogoIcon = ({ loginType }: { loginType: TypeOfLogin }) => {
  switch (loginType) {
    case "facebook":
      return <FacebookLogoIcon />;
    case "google":
      return <GoogleLogoIcon />;
    case "twitter":
      return <TwitterLogoIcon />;
    case "reddit":
      return <RedditLogoIcon />;
  }
};

const socialLabel = (loginType: TypeOfLogin) => {
  switch (loginType) {
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
