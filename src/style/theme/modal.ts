import { modalAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  modalAnatomy.keys
);

const baseStyle = definePartsStyle({
  dialog: {
    _dark: {
      bg: colors.gray[900], // TODO: add opacity & blur
    },
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
  sizes: { md: { dialog: { maxW: "482px" } } },
});
