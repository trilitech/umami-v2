import { Flex, Switch, useColorMode } from "@chakra-ui/react";

export const ColorSchemeModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const switchText = colorMode === "light" ? "Light mode" : "Dark mode";

  return (
    <Flex
      alignItems="center"
      gap="14px"
      display={{
        base: "none",
        md: "flex",
      }}
    >
      {switchText}
      <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
    </Flex>
  );
};
