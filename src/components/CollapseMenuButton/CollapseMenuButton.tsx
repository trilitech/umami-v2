import { Center, FlexProps } from "@chakra-ui/react";

import { BurgerMenuIcon } from "../../assets/icons";
import colors from "../../style/colors";

/**
 * Component used to toggle the side menu
 * should be used in conjunction with useCollapseMenu hook
 *
 * @param toggle - function to toggle the side menu (get it from the useCollapseMenu)
 */
export const CollapseMenuButton = ({ toggle, ...props }: FlexProps & { toggle: () => void }) => (
  <Center
    width="44px"
    height="44px"
    marginRight="-14px"
    borderRadius="4px"
    _hover={{ background: colors.gray[800] }}
    cursor="pointer"
    data-testid="collapse-menu-button"
    onClick={toggle}
    {...props}
  >
    <BurgerMenuIcon />
  </Center>
);
