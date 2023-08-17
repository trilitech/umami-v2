import { Box, ChakraProps } from "@chakra-ui/react";
import React from "react";

// No type definitions available.
// Lookup API here: https://github.com/tuhnik/react-identicons
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactIdenticons = require("react-identicons").default;

export const Identicon: React.FC<
  {
    address: string;
    identiconSize?: number;
  } & ChakraProps
> = ({ address, identiconSize = 32, ...props }) => {
  return (
    <Box
      data-testid="identicon"
      sx={{
        canvas: {
          borderRadius: "4px",
        },
      }}
      bg="white"
      borderRadius="4px"
      p="8px"
      {...props}
    >
      <ReactIdenticons
        style={{
          borderRadius: 4,
        }}
        bg="white"
        size={identiconSize}
        string={address}
      />
    </Box>
  );
};
