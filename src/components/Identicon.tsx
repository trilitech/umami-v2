import { Box, ChakraProps } from "@chakra-ui/react";
import md5 from "md5";
import React from "react";
// @ts-expect-error TS7016
import ReactIdenticonsMod from "react-identicons";

import { RawPkh } from "../types/Address";

// ReactIdenticons is defined as a CommonJS module
// the component is stored under the default property
// but that's not how ES modules work and with them
// we simply import the component directly
// CommonJS module is still used on jest though
// so, for dev & prod we need the object itself
// for tests, we need the default property
const ReactIdenticons =
  "default" in ReactIdenticonsMod ? ReactIdenticonsMod.default : ReactIdenticonsMod;

/**
 * That's how it's defined in react-identicons package
 * Unfortunately, it's not exported
 *
 * https://github.com/doke-v/react-identicons/blob/master/src/index.js#L25-L27
 */
export const color = (address: RawPkh) => `#${md5(address).slice(0, 6)}`;

export const Identicon: React.FC<
  {
    address: RawPkh;
    identiconSize: number;
  } & ChakraProps
> = ({ address, identiconSize, ...props }) => {
  return (
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
      <ReactIdenticons
        background="white"
        size={identiconSize}
        string={address}
        style={{
          borderRadius: 4,
        }}
      />
    </Box>
  );
};
