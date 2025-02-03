import { Image, SafeAreaView } from "react-native";
// @ts-ignore styled components will be removed in the future in favor of tamagui
// eslint-disable-next-line
import styled from "styled-components/native";

export const MainContainer = styled(SafeAreaView)`
  flex: 1;
`;

export const ContentWrapper = styled.View`
  flex: 1;
  padding-horizontal: 20px;
  justify-content: space-between;
`;

export const StyledImage = styled.Image`
  width: 100%;
  height: 350px;
  border-radius: 15px;
`;

export const ContinueLabel = styled.Text`
  margin-top: 35px;
  align-self: center;
  font-weight: 600;
  font-size: 16px;
`;

export const DividerWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DividerLine = styled.View`
  width: 47%;
  height: 1px;
  background-color: #e1e1ef;
`;

export const DividerLabel = styled.Text`
  margin-horizontal: 10px;
  font-weight: 600;
  font-size: 16px;
`;

const StyledButton = styled.TouchableOpacity`
  border-radius: 100px;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin-top: 10px;
`;

export const ButtonsWrapper = styled.View`
  margin-top: 20px;
`;

export const PrimaryButton = styled(StyledButton)`
  background-color: black;
`;

export const SecondaryButton = styled(StyledButton)`
  background-color: #e1e1ef;
`;

export const ButtonLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

export const PrimaryButtonLabel = styled(ButtonLabel)`
  color: white;
`;

export const FooterLabel = styled.Text`
  margin-top: 20px;
`;

export const LinksWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StyledLink = styled.Text`
  text-decoration-line: underline;
`;

export const FooterLinkLabel = styled.Text`
  margin-horizontal: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
`;

export const SocialButtonsWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-vertical: 30px;
`;

export const SocialIconWrapper = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  border-width: 1px;
  align-items: center;
  justify-content: center;
`;

export const GoogleImage = styled(Image)`
  width: 20px;
  height: 20px;
`;

export const FacebookRedditImage = styled(Image)`
  width: 26px;
  height: 26px;
`;

export const TwitterImage = styled(Image)`
  width: 16px;
  height: 16px;
`;

export const AppleImage = styled(Image)`
  width: 22px;
  height: 22px;
`;
