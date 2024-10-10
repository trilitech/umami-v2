import { Flex, Switch, useColorMode } from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";

export const ColorSchemeModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColor();

  const switchText = colorMode === "light" ? "Light mode" : "Dark mode";

  return (
    <Flex
      alignItems="center"
      gap="14px"
      display={{
        base: "none",
        md: "flex",
      }}
      color={color("500")}
    >
      {switchText}
      <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
    </Flex>
  );
};
