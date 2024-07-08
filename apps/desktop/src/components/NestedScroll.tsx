import { Box } from "@chakra-ui/react";
import { type ReactNode } from "react";

export const NestedScroll = (props: { children: ReactNode }) => (
  <Box overflowY="auto" height="100%">
    {props.children}
  </Box>
);
