import { Flex, FlexProps, Icon, IconProps, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons/lib";

import colors from "../style/colors";

type Props = {
  icon: IconType | React.FC<IconProps>;
  onClick?: () => void;
  label: string;
  iconWidth?: number | string;
  iconHeight?: number | string;
  iconColor?: string;
  textFirst?: boolean;
  textMargin?: string;
} & FlexProps;

/**
 * @deprecated To be replaced with a proper button
 */
export const IconAndTextBtn: React.FC<Props> = ({
  icon,
  onClick = () => {},
  label,
  iconWidth = 4,
  iconHeight = 4,
  textMargin = "4px",
  iconColor,
  textFirst,
  ...rest
}) => {
  const iconEL = <Icon as={icon} width={iconWidth} height={iconHeight} color={iconColor} />;
  const textMargin_ = textFirst ? { mr: textMargin } : { ml: textMargin };
  const textEl = (
    <Text {...textMargin_} fontSize="sm">
      {label}
    </Text>
  );
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      color="text.dark"
      _hover={{
        color: colors.gray[300],
      }}
      cursor="pointer"
      onClick={onClick}
      role="button"
      {...rest}
    >
      {textFirst ? textEl : null}
      {iconEL}
      {textFirst ? null : textEl}
    </Flex>
  );
};
