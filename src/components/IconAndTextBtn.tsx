import { Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons/lib";

export const IconAndTextBtn: React.FC<
  {
    icon: IconType;
    onClick?: () => void;
    label: string;
  } & FlexProps
> = ({ icon, onClick = () => {}, label, ...rest }) => {
  return (
    <Flex
      color="umami.gray.400"
      alignItems={"center"}
      onClick={onClick}
      cursor="pointer"
      {...rest}
    >
      <Icon w={6} h={6} as={icon} />
      <Text ml={2} fontSize={"sm"}>
        {label}
      </Text>
    </Flex>
  );
};
