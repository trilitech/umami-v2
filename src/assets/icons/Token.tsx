import { Image, ImageProps } from "@chakra-ui/react";

import icon from "../coin-front.svg";
import { RawPkh } from "../../types/Address";

export const TokenIcon: React.FC<{ contract: RawPkh } & ImageProps> = ({ contract, ...props }) => {
  const url = `https://services.tzkt.io/v1/avatars/${contract}`;
  return <TokenIconBase url={url} {...props} />;
};

const TokenIconBase: React.FC<{ url: string } & ImageProps> = ({ url, ...props }) => {
  return <Image fallbackSrc={icon} src={url} {...props} />;
};
