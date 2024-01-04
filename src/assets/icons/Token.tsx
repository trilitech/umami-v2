import { Image, ImageProps } from "@chakra-ui/react";

import { RawPkh } from "../../types/Address";
import icon from "../coin-front.svg";

export const TokenIcon: React.FC<{ contract: RawPkh } & ImageProps> = ({ contract, ...props }) => {
  const url = `https://services.tzkt.io/v1/avatars/${contract}`;
  return <Image fallbackSrc={icon} src={url} {...props} />;
};
