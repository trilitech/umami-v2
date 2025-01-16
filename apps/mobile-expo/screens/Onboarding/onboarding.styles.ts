import {SafeAreaView, TouchableOpacity, Image} from 'react-native';
import { styled, View, Text } from "@tamagui/core";

export const MainContainer = styled(SafeAreaView, {
  flex: 1,
});

export const ContentWrapper = styled(View, {
  flex: 1,
  paddingHorizontal: 20,
  justifyContent: 'space-between'
});

export const StyledImage = styled(Image, {
  width: '100%',
  height: 350,
  resizeMode: 'cover',
  borderRadius: 15,
});

export const ContinueLabel = styled(Text, {
  marginTop: 35,
  alignSelf: 'center',
  fontWeight: 600,
  fontSize: 16
});

export const DividerWrapper = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
});

export const DividerLine = styled(View, {
    width: '47%',
    height: 1,
    backgroundColor: '#E1E1EF',
  });

export const DividerLabel = styled(Text, {
  marginHorizontal: 10,
  fontWeight: 600,
  fontSize: 16,
});


const StyledButton = styled(TouchableOpacity, {
  borderRadius: 100,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 15,
  marginTop: 10,
});

export const ButtonsWrapper = styled(View, {
  marginTop: 20,
});

export const PrimaryButton = styled(StyledButton, {
  backgroundColor: 'black',
});

export const SecondaryButton = styled(StyledButton, {
  backgroundColor: '#E1E1EF',
});

export const ButtonLabel = styled(Text, {
  fontSize: 16,
  fontWeight: 600,
});

export const PrimaryButtonLabel = styled(ButtonLabel, {
  color: 'white',
});

export const FooterLabel = styled(Text, {
  marginTop: 20,
});

export const LinksWrapper = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
});

export const StyledLink = styled(Text, {
  textDecorationLine: 'underline',
});

export const FooterLinkLabel = styled(Text, {
  marginHorizontal: 10,
  fontWeight: 400,
  fontSize: 14,
  lineHeight: 18,
});

export const SocialButtonsWrapper = styled(View, {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginVertical: 30,
});

export const SocialIconWrapper = styled(View, {
  width: 48,
  height: 48,
  borderRadius: 24,
  borderWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

export const GoogleImage = styled(Image, {
  width: 20,
  height: 20,
});

export const FacebookRedditImage = styled(Image, {
  width: 26,
  height: 26,
});

export const TwitterImage = styled(Image, {
  width: 16,
  height: 16,
});

export const AppleImage = styled(Image, {
  width: 22,
  height: 22,
});
