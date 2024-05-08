import { Box, ChakraProps } from "@chakra-ui/react";
import md5 from "md5";
import React from "react";

import { ReactIdenticon } from "./ReactIdenticon";
import { RawPkh } from "../types/Address";

export const color = (address: RawPkh) => `#${md5(address).slice(0, 6)}`;

export const Identicon: React.FC<
  {
    address: RawPkh;
    identiconSize: number;
  } & ChakraProps
> = ({ address, identiconSize, ...props }) => (
  <Box
    sx={{
      canvas: {
        borderRadius: "4px",
      },
    }}
    zIndex={10}
    background="white"
    borderRadius="4px"
    data-testid="identicon"
    {...props}
  >
    <ReactIdenticon
      background="white"
      size={identiconSize}
      string={address}
      style={{
        borderRadius: 4,
      }}
    />
  </Box>
);
