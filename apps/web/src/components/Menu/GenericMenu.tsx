import { Box, Divider, DrawerBody, DrawerContent, Heading, VStack } from "@chakra-ui/react";
import { useDynamicDrawerContext } from "@umami/components";

import { MenuItem } from "./MenuItem";
import { type MenuItems } from "./types";
import { useColor } from "../../styles/useColor";
import { ModalCloseButton } from "../ModalCloseButton";
import { ModalBackButton } from "../Onboarding/ModalBackButton";

type GenericMenuProps = {
  title?: string;
  menuItems: MenuItems;
};

export const GenericMenu = ({ title, menuItems }: GenericMenuProps) => {
  const color = useColor();
  const { stack, goBack } = useDynamicDrawerContext();

  return (
    <DrawerContent>
      {stack.length > 1 && <ModalBackButton onClick={goBack} />}
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
