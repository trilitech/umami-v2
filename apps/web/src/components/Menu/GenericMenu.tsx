import { Box, type BoxProps, Divider, VStack } from "@chakra-ui/react";

import { DrawerContentWrapper } from "./DrawerContentWrapper";
import { MenuItem } from "./MenuItem";
import { type MenuItems } from "./types";

type GenericMenuProps = {
  title?: string;
  menuItems: MenuItems;
};

const lastBoxStyle = {
  flex: "1",
  display: "flex",
  flexDirection: "column" as BoxProps["flexDirection"],
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
      {menuItems.map((items, i) => {
        const isLastMenuGroup = i === menuItems.length - 1;
        return (
          <Box key={i} width="full" {...lastBoxStyle} _last={lastBoxStyle}>
            {items.map((item, y) => {
              const isLastMenuItem = y === items.length - 1;
              const lastMenuItemStyle = {
                ...(isLastMenuItem && isLastMenuGroup && { marginTop: "auto" }),
              };
              return <MenuItem key={item.label} {...item} style={lastMenuItemStyle} />;
            })}
          </Box>
        );
      })}
    </VStack>
  </DrawerContentWrapper>
);
