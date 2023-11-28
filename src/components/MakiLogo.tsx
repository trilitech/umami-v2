import React from "react";

import { Image, ImageProps } from "@chakra-ui/react";

import makiLogo from "../assets/maki-default.png";

export const MakiLogo: React.FC<{ size?: string | number } & ImageProps> = ({
  size = 100,
  ...props
}) => {
  return <Image boxSize={size} objectFit="cover" alt="Maki logo" src={makiLogo} {...props} />;
};
