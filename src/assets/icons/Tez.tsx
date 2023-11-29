import { Image, ImageProps } from "@chakra-ui/react";
import icon from "../tez.svg";

export const TezIcon: React.FC<ImageProps> = props => {
  return <Image data-testid="tez-icon" src={icon} {...props} />;
};
