import { Flex, Switch, useColorMode } from "@chakra-ui/react";

export const ColorSchemeModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const switchText = colorMode === "dark" ? "Light mode" : "Dark mode";

  return (
    <Flex
      alignItems="center"
      gap="14px"
      display={{
        base: "none",
        lg: "flex",
      }}
    >
      {switchText}
      <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
    </Flex>
  );
};
