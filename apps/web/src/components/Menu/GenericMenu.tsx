import { Divider, Flex, VStack } from "@chakra-ui/react";

import { DrawerContentWrapper } from "./DrawerContentWrapper";
import { MenuItem } from "./MenuItem";
import { type MenuItems } from "./types";

type GenericMenuProps = {
  title?: string;
  menuItems: MenuItems;
};

export const GenericMenu = ({ title, menuItems }: GenericMenuProps) => (
  <DrawerContentWrapper title={title}>
    <VStack
      gap={{ base: "18px", md: "24px" }}
      height="100%"
      marginTop={title ? { base: "36px", md: "40px" } : 0}
      divider={<Divider />}
      spacing="0"
    >
      {menuItems.map((items, i) => (
        <Flex key={i} flexDirection="column" width="full" _last={{ flex: 1 }}>
          {items.map((item) => (
            <MenuItem key={item.label} {...item} />
          ))}
        </Flex>
      ))}
    </VStack>
  </DrawerContentWrapper>
);
