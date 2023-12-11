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
export const listTheme = defineMultiStyleConfig({
  variants: { onboardingNotice: onboardingNoticeStyle },
});
