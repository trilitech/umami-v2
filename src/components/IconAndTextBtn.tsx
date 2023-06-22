import { Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons/lib";
import colors from "../style/colors";

export const IconAndTextBtn: React.FC<
  {
    icon: IconType;
    onClick?: () => void;
    label: string;
    iconWidth?: number;
    iconHeight?: number;
    iconColor?: string;
    textFirst?: boolean;
  } & FlexProps
> = ({
  icon,
  onClick = () => {},
  label,
  iconWidth = 4,
  iconHeight = 4,
  iconColor,
  textFirst,
  ...rest
}) => {
  const iconEL = <Icon w={iconWidth} h={iconHeight} as={icon} color={iconColor} />;
  const textMargin = textFirst ? { mr: 3 } : { ml: 3 };
  const textEl = (
    <Text {...textMargin} fontSize="sm">
      {label}
    </Text>
  );
  return (
    <Flex
      role="button"
      color="text.dark"
      alignItems="center"
      onClick={onClick}
      cursor="pointer"
      _hover={{
        color: colors.gray[300],
      }}
      {...rest}
    >
      {textFirst ? textEl : null}
      {iconEL}
      {textFirst ? null : textEl}
    </Flex>
  );
};
