import { Image, type ImageProps } from "@chakra-ui/react";
import { type RawPkh } from "@umami/tezos";

export const TokenIcon = ({ contract, ...props }: { contract: RawPkh } & ImageProps) => {
  const url = `https://services.tzkt.io/v1/avatars/${contract}`;
  return <Image fallbackSrc="./static/media/coin-front.svg" src={url} {...props} />;
};
