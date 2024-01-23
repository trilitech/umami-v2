import { Image, ImageProps } from "@chakra-ui/react";

import { RawPkh } from "../../types/Address";

export const TokenIcon: React.FC<{ contract: RawPkh } & ImageProps> = ({ contract, ...props }) => {
  const url = `https://services.tzkt.io/v1/avatars/${contract}`;
  return <Image fallbackSrc="/static/media/coin-front.svg" src={url} {...props} />;
};
