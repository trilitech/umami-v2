import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Flex, Heading } from "@chakra-ui/react";

import { CircleIcon } from "./CircleIcon";
import { DiamondIcon } from "../assets/icons";
import { SlideritemRecord } from "../graphql/generated";

export const SlideItem = ({ item }: { item: SlideritemRecord }) => {
  return (
    <Box paddingBottom="35px" data-testid={`slide-${item.id}`}>
      <Box
        height="400px"
        backgroundPosition="top"
        backgroundRepeat="no-repeat"
        __css={{
          backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(0, 0, 0, 1)), url(${item.image?.url})`,
        }}
      ></Box>
      <Flex flexDirection="column">
        <CircleIcon icon={<DiamondIcon width="32px" height="32px" />} size="58px" />
        <Heading margin="16px 50px 50px 50px">{item.text}</Heading>
      </Flex>
    </Box>
  );
};
