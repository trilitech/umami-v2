import { Box, type BoxProps } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

export const SocialIconWrapper = ({ children, ...props }: PropsWithChildren & BoxProps) => (
  <Box
    background="white"
    filter="drop-shadow(0px 0px 12px rgba(45, 55, 72, 0.08))"
    rounded="full"
    {...props}
  >
    {children}
  </Box>
);
