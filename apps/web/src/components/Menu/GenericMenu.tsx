import { Box, Divider, VStack } from "@chakra-ui/react";

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
      gap={{ base: "18px", lg: "24px" }}
      marginTop={title ? { base: "36px", lg: "40px" } : 0}
      divider={<Divider />}
      spacing="0"
    >
      {menuItems.map((items, index) => (
        <Box key={index} width="full">
          {items.map(item => (
            <MenuItem key={item.label} {...item} />
          ))}
        </Box>
      ))}
    </VStack>
  </DrawerContentWrapper>
);
