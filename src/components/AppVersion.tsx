import { Text, TextProps } from "@chakra-ui/react";
import colors from "../style/colors";
import packageInfo from "../../package.json";

export const AppVersion = (props: TextProps) => (
  <Text color={colors.gray[450]} {...props}>
    Umami v{packageInfo.version}
  </Text>
);
