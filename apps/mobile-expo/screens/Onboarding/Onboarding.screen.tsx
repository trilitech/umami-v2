import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

import {
  MainContainer,
  FooterLinkLabel,
  FooterLabel,
  GoogleImage,
  ContinueLabel,
  DividerLabel,
  DividerLine,
  DividerWrapper,
  LinksWrapper,
  ContentWrapper,
  WelcomeWrapper,
  PrimaryButtonLabel,
  PrimaryButton,
  StyledLink,
  StyledImage,
  SecondaryButton,
  SocialButtonsWrapper,
  SocialIconWrapper,
  FacebookRedditImage,
  TwitterImage,
  AppleImage,
  ButtonsWrapper,
} from "./onboarding.styles";
import { images } from "../../assets/images";
import { useOnboardingData } from "./useOnboardingData";

export const OnboardingScreen: React.FC = () => {
  const {
    userInfo,
    logout,
    promptAsync,
    openTerms,
    openPrivacy,
    strings,
    accessToken,
  } = useOnboardingData();

  return (
    <MainContainer>
      <ContentWrapper>
        <View style={{ flex: 1 }}>
          <StyledImage source={images.tezos} />
          <ContinueLabel>{strings.continueWith}</ContinueLabel>
          {!userInfo && (
            <SocialButtonsWrapper>
              <TouchableOpacity onPress={() => promptAsync()}>
                <SocialIconWrapper>
                  <GoogleImage source={images.google} />
                </SocialIconWrapper>
              </TouchableOpacity>
              <TouchableOpacity>
                <SocialIconWrapper>
                  <FacebookRedditImage source={images.facebook} />
                </SocialIconWrapper>
              </TouchableOpacity>
              <TouchableOpacity>
                <SocialIconWrapper>
                  <TwitterImage source={images.twitter} />
                </SocialIconWrapper>
              </TouchableOpacity>
              <TouchableOpacity>
                <SocialIconWrapper>
                  <FacebookRedditImage source={images.reddit} />
                </SocialIconWrapper>
              </TouchableOpacity>
              <TouchableOpacity>
                <SocialIconWrapper>
                  <AppleImage source={images.apple} />
                </SocialIconWrapper>
              </TouchableOpacity>
            </SocialButtonsWrapper>

          )}
          {userInfo && (
            <WelcomeWrapper>
              <Text>Welcome, {userInfo?.name}</Text>
              <Text>Access token: {accessToken?.substring(0, 40)}...</Text>
              <Button title={strings.logout} onPress={logout} />
            </WelcomeWrapper>
          )}
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
              <Text>{strings.alreadyHaveWallet}</Text>
            </SecondaryButton>
          </ButtonsWrapper>
        </View>
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

