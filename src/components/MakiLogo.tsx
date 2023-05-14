import React from "react";

import { Image } from "@chakra-ui/react";

import makiLogo from "../assets/maki-default.png";

export const MakiLogo: React.FC<{ size?: string | number }> = ({ size = 100 }) => {
  return (
    <Image boxSize={size} objectFit="cover" src={makiLogo} alt="Maki logo" />
  );
};
