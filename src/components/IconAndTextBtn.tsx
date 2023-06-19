import { Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons/lib";

export const IconAndTextBtn: React.FC<
  {
    icon: IconType;
    onClick?: () => void;
    label: string;
    iconWidth?: number;
    iconHeight?: number;
    iconColor?: string;
  } & FlexProps
> = ({ icon, onClick = () => {}, label, iconWidth = 6, iconHeight = 6, iconColor, ...rest }) => {
  return (
    <Flex color="text.dark" alignItems="center" onClick={onClick} cursor="pointer" {...rest}>
      <Icon w={iconWidth} h={iconHeight} as={icon} color={iconColor} />
      <Text ml={2} fontSize="sm">
        {label}
      </Text>
    </Flex>
  );
};
