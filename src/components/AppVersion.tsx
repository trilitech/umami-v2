import { Text, TextProps } from "@chakra-ui/react";

import packageInfo from "../../package.json";
import colors from "../style/colors";

export const AppVersion = (props: TextProps) => (
  <Text color={colors.gray[450]} {...props}>
    Umami v{packageInfo.version}
  </Text>
);
