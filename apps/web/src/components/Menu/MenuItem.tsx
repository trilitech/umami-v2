import { Flex, Icon, Text } from "@chakra-ui/react";

import { ChevronRightIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export type TMenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick: (value?: any) => Promise<void> | void;
  rightElement?: React.ReactNode;
  hasArrow?: boolean;
};

export type MenuItems = TMenuItem[][];

export const MenuItem = ({ label, icon, onClick, rightElement, hasArrow }: TMenuItem) => {
  const color = useColor();

  return (
    <Flex
      key={label}
      alignItems="center"
      gap="10px"
      width="full"
      padding="20px"
      color="gray.400"
      _hover={{
        bg: "gray.100",
      }}
      cursor="pointer"
      data-group
      onClick={onClick}
      rounded="full"
    >
      {icon}
      <Text marginRight="auto" color="gray.900" fontWeight="600" size="lg">
        {label}
      </Text>
      {hasArrow && (
        <Icon
          as={ChevronRightIcon}
          width="24px"
          height="24px"
          color={color("600")}
          _groupHover={{
            visibility: "visible",
          }}
          visibility="hidden"
        />
      )}
      {rightElement && <Flex onClick={e => e.stopPropagation()}>{rightElement}</Flex>}
    </Flex>
  );
};
