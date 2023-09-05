import { Image, ImageProps } from "@chakra-ui/react";

import icon from "../tez.svg";

const TezIcon: React.FC<ImageProps> = props => {
  return <Image data-testid="tez-icon" src={icon} {...props} />;
};

export default TezIcon;
