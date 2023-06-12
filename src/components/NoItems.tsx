import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";

export default function NoItems({
  text,
  primaryText,
  primaryCallback = () => {},
  secondaryText,
  secondaryCallback = () => {},
}: {
  text: string;
  primaryText?: string;
  primaryCallback?: () => void;
  secondaryText?: string;
  secondaryCallback?: () => void;
}) {
  return (
    <Flex
      width={"100%"}
      height={"100%"}
      alignContent={"center"}
      justifyContent={"center"}
    >
      <Center>
        <Box>
          <Heading size={"3xl"} p="42px">
            {text}
          </Heading>
          <Center>
            {primaryText ? (
              <Button
                bg="umami.blue"
                size="lg"
                mr="16px"
                onClick={primaryCallback}
              >
                {primaryText}
              </Button>
            ) : null}
            {secondaryText ? (
              <Button variant={"outline"} size="lg" onClick={secondaryCallback}>
                {secondaryText}
              </Button>
            ) : null}
          </Center>
        </Box>
      </Center>
    </Flex>
  );
}
