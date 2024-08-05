import { Box, type BoxProps } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

export const TokenIconWrapper = ({ children, ...props }: PropsWithChildren<BoxProps>) => (
  <Box
    background="white"
    boxShadow="0px 0px 10px 0px rgba(0, 0, 0, 0.10)"
    rounded="full"
    {...props}
  >
    {children}
  </Box>
);
