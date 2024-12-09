import { Image, SafeAreaView } from "react-native";
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
  height: 400px;
  resize-mode: cover;
  border-radius: 15px;
`;

export const ContinueLabel = styled.Text`
  margin-top: 20px;
  align-self: center;
`;

export const WelcomeWrapper = styled.View`
  margin-top: 20px;
`;

export const DividerWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DividerLine = styled.View`
  width: 47%;
  height: 1px;
  background-color: #E1E1EF;
`;

export const DividerLabel = styled.Text`
  margin-horizontal: 10px;
`;


const StyledButton = styled.TouchableOpacity`
  border-radius: 20px;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin-top: 10px;
`;

export const ButtonsWrapper = styled.View`
 margin-top: 10px;
`;

export const PrimaryButton = styled(StyledButton)`
  background-color: black;
`;

export const SecondaryButton = styled(StyledButton)`
  background-color: #E1E1EF
`;

export const PrimaryButtonLabel = styled.Text`
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
`;

export const SocialButtonsWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-vertical: 20px;
`;

export const SocialIconWrapper = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
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
