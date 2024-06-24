import { Button, Flex, Heading } from "@chakra-ui/react";
import { type TypeOfLogin } from "@trilitech-umami/umami-embed/types";

import { FacebookLogoIcon, GoogleLogoIcon, RedditLogoIcon, TwitterLogoIcon } from "./assets/icons";
import colors from "./imported/style/colors";

export const LoginButtonComponent: React.FC<{
  onClick: () => void;
  loginType: TypeOfLogin;
}> = ({ onClick, loginType }) => (
  <Button width="100%" onClick={onClick} size="lg">
    <Flex alignItems="center" justifyContent="flex-start" flex={1}>
      <LogoIcon loginType={loginType} />
      <Heading margin="auto" textColor={colors.white} fontSize="14px" lineHeight="18px">
        {buttonLabel(loginType)}
      </Heading>
    </Flex>
  </Button>
);

const LogoIcon: React.FC<{
  loginType: TypeOfLogin;
}> = ({ loginType }) => {
  switch (loginType) {
    case "facebook":
      return <FacebookLogoIcon position="absolute" />;
    case "google":
      return <GoogleLogoIcon position="absolute" />;
    case "twitter":
      return <TwitterLogoIcon position="absolute" />;
    case "reddit":
      return <RedditLogoIcon position="absolute" />;
  }
};

const buttonLabel = (loginType: TypeOfLogin) => {
  switch (loginType) {
    case "facebook":
      return "Facebook";
    case "google":
      return "Google";
    case "twitter":
      return "X";
    default:
      return "Reddit";
  }
};
