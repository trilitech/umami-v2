import { Box } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

export const TokenIconWrapper = ({ children }: PropsWithChildren) => (
  <Box background="white" boxShadow="0px 0px 10px 0px rgba(0, 0, 0, 0.10)" rounded="full">
    {children}
  </Box>
);
