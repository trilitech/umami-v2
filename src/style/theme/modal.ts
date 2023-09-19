import { modalAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/styled-system";
import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  modalAnatomy.keys
);

const modalButtonBaseStyle = {
  top: "10px",
  position: "absolute" as const,
  color: colors.gray[400],
  borderRadius: "18px",
};

const closeButtonStyle = defineStyle({
  ...modalButtonBaseStyle,
  insetEnd: "10px",
});

export const backButtonStyle = defineStyle({
  ...modalButtonBaseStyle,
  insetStart: "10px",
});

const baseStyle = definePartsStyle({
  dialog: {
    padding: "40px",
    _dark: {
      bg: colors.gray[900],
      border: "1px solid",
      borderColor: colors.gray[700],
      borderRadius: "8px",
    },
  },
  overlay: {
    _dark: {
      bg: "rgba(0, 0, 0, 0.85)",
    },
  },
  closeButton: closeButtonStyle,
  body: {
    padding: 0,
  },
  footer: {
    padding: "32px 0 0 0",
  },
  header: {
    padding: 0,
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
  sizes: { md: { dialog: { maxW: "482px" } } },
});
