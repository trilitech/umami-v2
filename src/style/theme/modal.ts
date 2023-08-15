import { modalAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  modalAnatomy.keys
);

const baseStyle = definePartsStyle({
  dialog: {
    paddint: "40px",
    _dark: {
      bg: colors.gray[900], // TODO: add opacity & blur
      border: "1px solid",
      borderColor: colors.gray[700],
    },
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
  sizes: { md: { dialog: { maxW: "482px" } } },
});
