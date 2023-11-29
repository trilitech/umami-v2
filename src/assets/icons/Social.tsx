import { Image, ImageProps } from "@chakra-ui/react";
import icon from "../google-icon.svg";

export const SocialIcon: React.FC<ImageProps> = props => {
  return <Image data-testid="social-icon" src={icon} {...props} />;
};
