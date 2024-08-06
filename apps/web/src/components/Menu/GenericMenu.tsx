import { Box, Divider, DrawerBody, DrawerContent, Heading, VStack } from "@chakra-ui/react";

import { MenuItem } from "./MenuItem";
import { type MenuItems } from "./types";
import { useColor } from "../../styles/useColor";
import { DrawerBackButton } from "../BackButton";
import { ModalCloseButton } from "../ModalCloseButton";

type GenericMenuProps = {
  title?: string;
  menuItems: MenuItems;
};

export const GenericMenu = ({ title, menuItems }: GenericMenuProps) => {
  const color = useColor();

  return (
    <DrawerContent>
      <DrawerBackButton />
      <ModalCloseButton />
      <DrawerBody paddingTop="90px">
        {title && (
          <Heading marginBottom="40px" color={color("900")} fontSize="24px">
            {title}
          </Heading>
        )}
        <VStack gap={{ base: "18px", lg: "24px" }} divider={<Divider borderColor={color("100")} />}>
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
