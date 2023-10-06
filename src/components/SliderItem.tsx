import "react-responsive-carousel/lib/styles/carousel.min.css";
import { CircleIcon, SupportedIcons } from "./CircleIcon";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { SlideritemRecord } from "../graphql/generated";

export default function SlideItem({ item }: { item: SlideritemRecord }) {
  return (
    <Box data-testid={`slide-${item.id}`} paddingBottom="35px">
      <Box
        backgroundRepeat="no-repeat"
        backgroundPosition="top"
        __css={{
          backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(0, 0, 0, 1)), url(${item.image?.url})`,
        }}
        height="400px"
      ></Box>
      <Flex flexDirection="column">
        <CircleIcon size="58px" iconSize="24px" icon={item.icon as SupportedIcons} />
        <Heading margin="16px 50px 50px 50px">{item.text}</Heading>
      </Flex>
    </Box>
  );
}
