import { Image, type ImageProps } from "@chakra-ui/react";
import { type RawPkh } from "@umami/tezos";

type TokenIconProps = {
  contract: RawPkh;
} & ImageProps;

export const TokenIcon = ({ contract, ...props }: TokenIconProps) => {
  const url = `https://services.tzkt.io/v1/avatars/${contract}`;
  return <Image fallbackSrc="./static/coin-front.svg" src={url} {...props} />;
};
