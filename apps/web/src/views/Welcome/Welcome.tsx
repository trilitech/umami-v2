import {
  Button,
  Center,
  Divider,
  Flex,
  type FlexProps,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  type IconButtonProps,
  Link,
  type LinkProps,
  Text,
  type TextProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useState } from "react";

import { LogoLightIcon, TezosLogoIcon } from "../../assets/icons";
import {
  FacebookAccountIcon,
  GoogleAccountIcon,
  RedditAccountIcon,
  TwitterAccountIcon,
} from "../../components/AccountTile/AccountTileIcon";
import { ImportWallet } from "../../components/Onboarding/ImportWallet";
import { useColor } from "../../styles/useColor";

export const Welcome = () => {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const color = useColor();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { openWith } = useDynamicModalContext();

  return (
    <Grid
      justifyItems="center"
      gridGap={{ base: "36px", lg: "60px" }}
      gridTemplateRows={{ base: "130px auto", lg: "auto 444px auto" }}
      gridTemplateAreas={{
        base: "'header' 'main'",
        lg: `
     'header header header'
     'main main main'
     'copyright tezos-logo social'
    `,
      }}
      height="100vh"
      padding={{ base: "24px 0 0 0", lg: "24px 46px 46px 46px" }}
      data-testid="welcome-view"
    >
      <Flex
        alignItems="center"
        justifyContent="end"
        flexDirection="column"
        gridArea="header"
        display={isOnboarding ? "none" : "flex"}
      >
        <Icon as={LogoLightIcon} width="42px" height="42px" />
        <Heading marginTop="18px" color={color("900")} size="3xl">
          Welcome to Umami
        </Heading>
        <Text marginTop="6px" color={color("600")} size="lg">
          A powerful Tezos wallet
        </Text>
      </Flex>

      <Flex
        gridArea="main"
        display={isOnboarding ? "none" : "flex"}
        width={{ base: "full", lg: "510px" }}
      >
        <Flex
          alignItems="center"
          alignContent="start"
          flexDirection="column"
          width="full"
          height="full"
          padding={{ base: "36px 12px", lg: "36px 42px" }}
          border="1px solid"
          borderColor={color("100")}
          borderTopRadius="30px"
          borderBottomRadius={{ base: 0, lg: "30px" }}
          backgroundColor={color("white")}
        >
          <Heading color={color("900")} size="lg">
            Continue with:
          </Heading>

          <Center flexDirection="column" gap="36px" width="full" height="full">
            <Flex
              gap={{ base: "24px", lg: "30px" }}
              marginTop="30px"
              color={color("white", "black")}
            >
              <SocialLoginButton aria-label="google-login" icon={<GoogleAccountIcon />} />
              <SocialLoginButton aria-label="facebook-login" icon={<FacebookAccountIcon />} />
              <SocialLoginButton aria-label="twitter-login" icon={<TwitterAccountIcon />} />
              <SocialLoginButton aria-label="reddit-login" icon={<RedditAccountIcon />} />
            </Flex>

            <Center gap="4px" width="full">
              <Divider width="full" />
              <Text color={color("500")} size="lg">
                or
              </Text>
              <Divider width="full" />
            </Center>

            <Flex flexDirection="column" gap="12px" width="full">
              <Button width="full" size="lg" variant="primary">
                Create a new wallet
              </Button>
              <Button
                width="full"
                onClick={() => {
                  setIsOnboarding(true);
                  return openWith(<ImportWallet />, {
                    size: "xl",
                    variant: "onboarding",
                    onClose: () => setIsOnboarding(false),
                  });
                }}
                size="lg"
                variant="secondary"
              >
                I already have a wallet
              </Button>
            </Flex>

            <Text color={color("700")} size="sm">
              By proceeding, you agree to Umami's{" "}
              <Link fontWeight="600" href="https://umamiwallet.com/tos.html" isExternal>
                Terms of Use
              </Link>
            </Text>

            {isMobile && (
              <>
                <Flex gap="10px">
                  <TermsLink />
                  <Divider height="24px" orientation="vertical" />
                  <PrivacyLink />
                  <Divider height="24px" orientation="vertical" />
                  <SupportLink />
                  <Divider height="24px" orientation="vertical" />
                  <CommunityLink />
                  <Divider height="24px" orientation="vertical" />
                </Flex>

                <Copyright />

                <Logo />
              </>
            )}
          </Center>
        </Flex>
      </Flex>
      {!isMobile && (
        <>
          <GridItem
            justifySelf="start"
            alignSelf="end"
            gap="10px"
            gridArea="copyright"
            display="flex"
            marginBottom="5px"
            color={color("700")}
          >
            <Copyright />
            <Divider height="24px" orientation="vertical" />
            <TermsLink />
            <Divider height="24px" orientation="vertical" />
            <PrivacyLink />
          </GridItem>

          <Logo alignSelf="end" gridArea="tezos-logo" />

          <GridItem
            zIndex={1401}
            justifySelf="end"
            alignSelf="end"
            gap="10px"
            gridArea="social"
            display="flex"
            marginBottom="5px"
            color={color("700")}
          >
            <SupportLink />
            <Divider height="24px" orientation="vertical" />
            <CommunityLink />
            <Divider height="24px" orientation="vertical" />
            <ArticlesLink />
          </GridItem>
        </>
      )}
    </Grid>
  );
};

const SocialLoginButton = (props: IconButtonProps) => {
  const color = useColor();

  return (
    <IconButton
      _hover={{ backgroundColor: color("400", "600") }}
      backgroundColor={color("white", "black")}
      size="lg"
      {...props}
    />
  );
};

const TermsLink = (props: LinkProps) => (
  <Link href="https://umamiwallet.com/tos.html" isExternal {...props}>
    Terms
  </Link>
);

const PrivacyLink = (props: LinkProps) => (
  <Link href="https://umamiwallet.com/privacypolicy.html" isExternal {...props}>
    Privacy
  </Link>
);

const SupportLink = (props: LinkProps) => (
  <Link href="mailto:umami-support@trili.tech" isExternal {...props}>
    Support
  </Link>
);

const CommunityLink = (props: LinkProps) => (
  <Link
    href="https://join.slack.com/t/tezos-dev/shared_invite/zt-1ur1ymxrp-G_X_bFHrvWXwoeiy53J8lg"
    isExternal
    {...props}
  >
    Community
  </Link>
);

const ArticlesLink = (props: LinkProps) => (
  <Link href="https://medium.com/umamiwallet" isExternal {...props}>
    Articles
  </Link>
);

const Logo = (props: FlexProps) => (
  <Center gap="10px" {...props}>
    <Text color="gray.400" size="sm">
      Powered by
    </Text>
    <Icon as={TezosLogoIcon} width="103.61px" height="35.84px" color="gray.400" />
  </Center>
);

const Copyright = (props: TextProps) => <Text {...props}>© 2024 Umami</Text>;
