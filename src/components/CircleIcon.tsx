import { Box, Center } from "@chakra-ui/react";
import colors from "../style/colors";

type Props = {
  icon: JSX.Element;
  size?: string;
  color?: string;
  onClick?: () => void;
};

export const CircleIcon = ({ icon, size, onClick = () => {} }: Props) => {
  return (
    <Box
      height={size}
      width={size}
      borderRadius="full"
      bg={colors.gray[700]}
      margin="auto"
      onClick={onClick}
    >
      <Center h="100%">{icon}</Center>
    </Box>
  );
};
