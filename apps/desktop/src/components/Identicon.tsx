import { Box, type ChakraProps } from "@chakra-ui/react";
import { type Address, type RawPkh } from "@umami/tezos";
import md5 from "md5";
import type React from "react";

import { ReactIdenticon } from "./ReactIdenticon";

export const color = (address: RawPkh) => `#${md5(address).slice(0, 6)}`;

export const Identicon: React.FC<
  {
    address: Address;
    identiconSize: number;
  } & ChakraProps
> = ({ address, identiconSize, ...props }) => (
  <Box
    sx={{
      canvas: {
        borderRadius: "4px",
      },
    }}
    zIndex={3}
    background="white"
    borderRadius="4px"
    data-testid="identicon"
    {...props}
  >
    <ReactIdenticon
      background="white"
      size={identiconSize}
      string={address.pkh}
      style={{
        borderRadius: 4,
      }}
    />
  </Box>
);
