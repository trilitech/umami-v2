import { Box, ChakraProps } from "@chakra-ui/react";
import React from "react";
// @ts-expect-error TS7016
import ReactIdenticonsMod from "react-identicons";

// ReactIdenticons is defined as a CommonJS module
// the component is stored under the default property
// but that's not how ES modules work and with them
// we simply import the component directly
// CommonJS module is still used on jest though
// so, for dev & prod we need the object itself
// for tests, we need the default property
const ReactIdenticons =
  "default" in ReactIdenticonsMod ? ReactIdenticonsMod.default : ReactIdenticonsMod;

export const Identicon: React.FC<
  {
    address: string;
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
