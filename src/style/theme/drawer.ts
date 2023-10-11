import { drawerAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle(props => ({
  body: {
    padding: "24px 30px 30px 30px",
  },
  dialog: {
    bg: colors.gray[900],
  },
}));

export const drawerTheme = defineMultiStyleConfig({
  baseStyle,
  sizes: { md: { dialog: { maxW: "594px" } } },
  defaultProps: {
    size: "md",
  },
});
