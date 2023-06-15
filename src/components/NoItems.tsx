import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";

export default function NoItems({
  text,
  primaryText,
  onClickPrimary = () => {},
  secondaryText,
  onClickSecondary = () => {},
}: {
  text: string;
  primaryText?: string;
  onClickPrimary?: () => void;
  secondaryText?: string;
  onClickSecondary?: () => void;
}) {
  return (
    <Flex width={"100%"} height={"100%"} alignContent={"center"} justifyContent={"center"}>
      <Center>
        <Box>
          <Heading size={"3xl"} p="42px">
            {text}
          </Heading>
          <Center>
            {primaryText ? (
              <Button bg="umami.blue" size="lg" mr="16px" onClick={onClickPrimary}>
                {primaryText}
              </Button>
            ) : null}
            {secondaryText ? (
              <Button variant={"outline"} size="lg" onClick={onClickSecondary}>
                {secondaryText}
              </Button>
            ) : null}
          </Center>
        </Box>
      </Center>
    </Flex>
  );
}
