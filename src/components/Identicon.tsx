import { Box } from "@chakra-ui/react";
import React from "react";

// No type definitions available.
// Lookup API here: https://github.com/tuhnik/react-identicons
const ReactIdenticons = require("react-identicons").default;

export const Identicon: React.FC<{ address: string }> = ({ address }) => {
  return (
    <Box
      sx={{
        canvas: {
          borderRadius: "4px",
        },
      }}
    >
      <ReactIdenticons
        style={{
          borderRadius: 4,
        }}
        size={48}
        string={address}
      />
    </Box>
  );
};
