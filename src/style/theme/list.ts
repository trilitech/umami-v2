import { listAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const onboardingNoticeStyle = definePartsStyle({
  item: {
    "&::marker": {
      color: colors.gray[400],
    },
  },
});

const suggestionsStyle = definePartsStyle({
  item: {
    _hover: {
      background: colors.gray[500],
    },
    background: colors.gray[700],
    borderRadius: "4px",
    cursor: "pointer",
    height: "28px",
    listStyleType: "none",
  },
  container: {
    background: colors.gray[700],
    border: "1px solid",
    borderColor: colors.gray[500],
    borderRadius: "8px",
    listStyleType: "none",
    marginLeft: "0 !important",
    overflowX: "hidden",
    padding: "10px",
    position: "absolute",
    width: "100%",
    zIndex: 2,
    maxHeight: "130px",
  },
});

export const listTheme = defineMultiStyleConfig({
  variants: { onboardingNotice: onboardingNoticeStyle, suggestions: suggestionsStyle },
});
