import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export const NestedScroll: React.FC<{ children: ReactNode }> = props => (
  <Box overflowY="auto" height="100%">
    {props.children}
  </Box>
);
