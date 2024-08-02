import { Flex, useColorMode } from "@chakra-ui/react";
import { TezosSpinner } from "./assets/icons/TezosSpinner";

import { mode } from "@chakra-ui/theme-tools";

export const ModalLoadingOverlay = () => {
  const colorMode = useColorMode();

  return (
    <Flex
      position="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
      alignItems="center"
      justifyContent="center"
      borderRadius="30px"
      backgroundColor={mode(
        "rgba(255, 255, 255, 0.85)", // light
        "rgba(16, 18, 27, 0.85)" // dark
      )(colorMode)}
    >
      <TezosSpinner />
    </Flex>
  );
};
