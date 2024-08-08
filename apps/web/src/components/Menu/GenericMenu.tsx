import { Box, Divider, DrawerBody, DrawerContent, Heading, VStack } from "@chakra-ui/react";

import { MenuItem } from "./MenuItem";
import { type MenuItems } from "./types";
import { useColor } from "../../styles/useColor";
import { DrawerBackButton } from "../BackButton";
import { DrawerCloseButton } from "../CloseButton";

type GenericMenuProps = {
  title?: string;
  menuItems: MenuItems;
};

export const GenericMenu = ({ title, menuItems }: GenericMenuProps) => {
  const color = useColor();

  return (
    <DrawerContent>
      <DrawerBackButton />
      <DrawerCloseButton />
      <DrawerBody paddingTop="90px">
        {title && (
          <Heading marginBottom="40px" color={color("900")} size="2xl">
            {title}
          </Heading>
        )}
        <VStack gap={{ base: "18px", lg: "24px" }} divider={<Divider />} spacing="0">
          {menuItems.map((items, index) => (
            <Box key={index} width="full">
              {items.map(item => (
                <MenuItem key={item.label} {...item} />
              ))}
            </Box>
          ))}
        </VStack>
      </DrawerBody>
    </DrawerContent>
  );
};
