import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  tabsAnatomy.keys
);

const baseStyle = definePartsStyle({
  tab: {
    _selected: {
      fontWeight: 600,
      color: colors.white,
      borderColor: colors.orange,
      borderBottom: `2px solid ${colors.orange}`,
    },
  },
});

export const tabsTheme = defineMultiStyleConfig({
  baseStyle,
});
