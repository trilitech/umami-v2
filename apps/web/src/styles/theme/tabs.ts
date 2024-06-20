import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  tabsAnatomy.keys
);

const baseStyle = definePartsStyle({
  tab: {
    padding: "10px 40px !important",
    color: colors.grey[500],
    _selected: {
      fontWeight: 600,
      color: colors.grey[900],
      bg: colors.grey[200],
      borderRadius: "100px",
    },
  },
});

export const tabsTheme = defineMultiStyleConfig({
  baseStyle,
});
