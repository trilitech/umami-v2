import { Box, Center } from "@chakra-ui/react";
import { ReactNode } from "react";

import colors from "../style/colors";

type Props = {
  icon: ReactNode;
  size?: string;
  color?: string;
  onClick?: () => void;
};

export const CircleIcon = ({ icon, size, onClick = () => {} }: Props) => (
  <Box
    width={size}
    height={size}
    margin="auto"
    background={colors.gray[700]}
    borderRadius="full"
    onClick={onClick}
  >
    <Center height="100%">{icon}</Center>
  </Box>
);
