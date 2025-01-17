import { TouchableOpacity, View } from "react-native";
import { Button } from "tamagui";

import {
  AppleImage,
  ButtonLabel,
  ButtonsWrapper,
  ContentWrapper,
  ContinueLabel,
  DividerLabel,
  DividerLine,
  DividerWrapper,
  FacebookRedditImage,
  FooterLabel,
  FooterLinkLabel,
  GoogleImage,
  LinksWrapper,
  MainContainer,
  PrimaryButton,
  PrimaryButtonLabel,
  SecondaryButton,
  SocialButtonsWrapper,
  SocialIconWrapper,
  StyledImage,
  StyledLink,
  TwitterImage,
} from "./onboarding.styles";
import { useOnboardingData } from "./useOnboardingData";
import { images } from "../../assets/images";

export const OnboardingScreen = () => {
  const {
    onGoogleLogin,
    onFacebookLogin,
    onXLogin,
    onRedditLogin,
    onAppleLogin,
    openTerms,
    openPrivacy,
    strings,
  } = useOnboardingData();

  return (
    <MainContainer>
      <ContentWrapper>
        <MainContainer>
          {/*TODO: change image*/}
          <StyledImage resizeMode="cover" source={images.tezos} />
          <ContinueLabel>{strings.continueWith}</ContinueLabel>
          <SocialButtonsWrapper>
            <TouchableOpacity onPress={onGoogleLogin}>
              <SocialIconWrapper>
                <GoogleImage source={images.google} />
              </SocialIconWrapper>
            </TouchableOpacity>
            <TouchableOpacity onPress={onFacebookLogin}>
              <SocialIconWrapper>
                <FacebookRedditImage source={images.facebook} />
              </SocialIconWrapper>
            </TouchableOpacity>
            <TouchableOpacity onPress={onXLogin}>
              <SocialIconWrapper>
                <TwitterImage source={images.twitter} />
              </SocialIconWrapper>
            </TouchableOpacity>
            <TouchableOpacity onPress={onRedditLogin}>
              <SocialIconWrapper>
                <FacebookRedditImage source={images.reddit} />
              </SocialIconWrapper>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAppleLogin}>
              <SocialIconWrapper>
                <AppleImage source={images.apple} />
              </SocialIconWrapper>
            </TouchableOpacity>
          </SocialButtonsWrapper>

          <DividerWrapper>
            <DividerLine />
            <DividerLabel>{strings.or}</DividerLabel>
            <DividerLine />
          </DividerWrapper>

          <ButtonsWrapper>
            <PrimaryButton>
              <PrimaryButtonLabel>{strings.createWallet}</PrimaryButtonLabel>
            </PrimaryButton>

            <SecondaryButton>
              <ButtonLabel>{strings.alreadyHaveWallet}</ButtonLabel>
            </SecondaryButton>

            <Button>Tamagui Button</Button>
          </ButtonsWrapper>
        </MainContainer>
        <View style={{ alignItems: "center" }}>
          <FooterLabel>{strings.byProceeding}</FooterLabel>
          <LinksWrapper>
            <StyledLink onPress={openTerms}>{strings.terms}</StyledLink>
            <FooterLinkLabel>{strings.and}</FooterLinkLabel>
            <StyledLink onPress={openPrivacy}>{strings.privacyPolicy}</StyledLink>
          </LinksWrapper>
        </View>
      </ContentWrapper>
    </MainContainer>
  );
};
