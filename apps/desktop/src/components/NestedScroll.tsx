import { Box } from "@chakra-ui/react";
import type React from "react";
import { type ReactNode } from "react";

export const NestedScroll: React.FC<{ children: ReactNode }> = props => (
  <Box overflowY="auto" height="100%">
    {props.children}
  </Box>
);
