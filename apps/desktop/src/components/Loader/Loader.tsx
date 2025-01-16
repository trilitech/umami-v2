import { Flex, Spinner } from "@chakra-ui/react";

export const Loader = () => (
  <Flex
    position="absolute"
    zIndex="9999"
    top="0"
    left="0"
    alignItems="center"
    justifyContent="center"
    width="full"
    height="100vh"
    backdropFilter="blur(10px)"
    backgroundColor="rgba(0, 0, 0, 0.2)"
  >
    <Spinner />
  </Flex>
);
