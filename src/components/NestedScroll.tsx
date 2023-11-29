import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

export const NestedScroll: React.FC<{ children: ReactNode }> = props => {
  return (
    <Box overflowY="auto" height="100%">
      {props.children}
    </Box>
  );
};
