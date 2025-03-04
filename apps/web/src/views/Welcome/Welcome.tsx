import {
  Center,
  Divider,
  Flex,
  type FlexProps,
  Grid,
  GridItem,
  Heading,
  Icon,
  Link,
  type LinkProps,
  Text,
  type TextProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import Hotjar from "@hotjar/browser";
import { useDynamicModalContext } from "@umami/components";

import { LogoLightIcon, TezosLogoIcon } from "../../assets/icons";
import { OnboardOptions } from "../../components/Onboarding/OnboardOptions";
import { useColor } from "../../styles/useColor";

export const Welcome = () => {
  const color = useColor();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isOnboarding } = useDynamicModalContext();

  Hotjar.stateChange("welcome");

  return (
    <Grid
      className="welcome-view"
      justifyItems="center"
      gridGap={{ base: "36px", md: "60px" }}
      gridTemplateRows={{ base: "130px auto", md: "auto 444px auto" }}
      gridTemplateAreas={{
        base: "'header' 'main'",
        md: `
     'header header header'
     'main main main'
     'copyright tezos-logo social'
    `,
      }}
      height="100vh"
      padding={{ base: "24px 0 0 0", md: "24px 46px 46px 46px" }}
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
        width={{ base: "full", md: "510px" }}
      >
        <Flex
          alignItems="center"
          alignContent="start"
          flexDirection="column"
          width="full"
          height="full"
          padding={{ base: "36px", md: "36px 42px" }}
          color={color("700")}
          fontSize="14px"
          border="1px solid"
          borderColor={color("100")}
          borderTopRadius="30px"
          borderBottomRadius={{ base: 0, md: "30px" }}
          backgroundColor={color("white")}
        >
          <OnboardOptions>
            <Text color={color("700")} size="sm">
              By proceeding, you agree to Umami's{" "}
              <Link
                fontWeight="600"
                textDecoration="underline"
                _hover={{
                  color: color("500"),
                }}
                href="https://umamiwallet.com/tos.html"
                isExternal
              >
                Terms of Use
              </Link>
            </Text>
            {isMobile && (
              <>
                <Flex gap="10px">
                  <TermsLink />
                  <Divider height="24px" color={color("300")} orientation="vertical" />
                  <PrivacyLink />
                  <Divider height="24px" color={color("300")} orientation="vertical" />
                  <SupportLink />
                  <Divider height="24px" color={color("300")} orientation="vertical" />
                  <CommunityLink />
                </Flex>

                <Copyright />

                <Logo />
              </>
            )}
          </OnboardOptions>
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
            fontSize="14px"
          >
            <Copyright />
            <Divider height="24px" color={color("300")} orientation="vertical" />
            <TermsLink />
            <Divider height="24px" color={color("300")} orientation="vertical" />
            <PrivacyLink />
          </GridItem>

          <Logo alignSelf="end" gridArea="tezos-logo" />

          <GridItem
            justifySelf="end"
            alignSelf="end"
            gap="10px"
            gridArea="social"
            display="flex"
            marginBottom="5px"
            color={color("700")}
            fontSize="14px"
          >
            <SupportLink />
            <Divider height="24px" color={color("300")} orientation="vertical" />
            <CommunityLink />
            <Divider height="24px" color={color("300")} orientation="vertical" />
            <ArticlesLink />
          </GridItem>
        </>
      )}
    </Grid>
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
