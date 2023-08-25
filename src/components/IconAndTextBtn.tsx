import { Flex, FlexProps, Icon, Text, Link, IconProps } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons/lib";
import colors from "../style/colors";

type Props = {
  icon: IconType | React.FC<IconProps>;
  onClick?: () => void;
  label: string;
  iconWidth?: number;
  iconHeight?: number;
  iconColor?: string;
  textFirst?: boolean;
} & FlexProps;

// TODO: Replace with a proper button
export const IconAndTextBtn: React.FC<Props> = ({
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
      justifyContent="space-between"
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

export const IconAndTextBtnLink: React.FC<Props & { href: string }> = ({ href, ...props }) => {
  return (
    <Link
      role="link"
      href={href}
      display="flex"
      target="_blank"
      rel="noreferrer"
      sx={{
        "&:hover": {
          textDecoration: "none",
        },
      }}
    >
      <IconAndTextBtn {...props} />
    </Link>
  );
};
