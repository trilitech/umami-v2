import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  cardAnatomy.keys
);

const baseStyle = definePartsStyle({
  container: {
    boxShadow: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
  },
});

export const cardTheme = defineMultiStyleConfig({
  baseStyle,
});
