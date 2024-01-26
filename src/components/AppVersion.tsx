import { Text, TextProps } from "@chakra-ui/react";

import packageInfo from "../../package.json";
import colors from "../style/colors";

export const AppVersion = ({ isCollapsed, ...props }: TextProps & { isCollapsed?: boolean }) => {
  const versionInfo = isCollapsed ? packageInfo.version : `Umami v${packageInfo.version}`;

  return (
    <Text color={colors.gray[450]} {...props}>
      {versionInfo}
    </Text>
  );
};
