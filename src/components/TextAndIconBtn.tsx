import { Flex, Icon, Text } from "@chakra-ui/react";
import { FC } from "react";
import { IconType } from "react-icons";
import colors from "../style/colors";

export const TextAndIconBtn: FC<{
  text: string;
  icon: IconType;
  onClick: () => void;
}> = ({ text, icon, onClick }) => {
  return (
    <Flex
      alignItems="center"
      color={colors.gray[600]}
      _hover={{
        color: colors.gray[300],
      }}
      cursor="pointer"
      onClick={onClick}
    >
      <Text size="sm" mr={3}>
        {text}
      </Text>
      <Icon as={icon} />
    </Flex>
  );
};
