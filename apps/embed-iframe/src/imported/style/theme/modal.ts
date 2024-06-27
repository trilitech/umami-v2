import { modalAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/styled-system";

import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  modalAnatomy.keys
);

const modalButtonBaseStyle = {
  top: "10px",
  position: "absolute" as const,
  color: colors.grey[400],
  borderRadius: "18px",
};

const closeButtonStyle = defineStyle({
  ...modalButtonBaseStyle,
  insetEnd: "10px",
});

const baseStyle = definePartsStyle({
  dialog: {
    paddingTop: "36px",
    paddingBottom: "36px",
    paddingLeft: "42px",
    paddingRight: "42px",
    bg: colors.grey.white,
    border: "1.5px solid",
    borderColor: colors.grey[100],
    borderRadius: "30px",
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
  sizes: { md: { dialog: { maxW: "384px" } } },
});
