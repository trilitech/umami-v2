import "react-responsive-carousel/lib/styles/carousel.min.css";
import { CircleIcon, SupportedIcons } from "./CircleIcon";
import { Box, Text } from "@chakra-ui/react";
import { SlideritemRecord } from "../graphql/generated";
import colors from "../style/colors";

export default function SlideItem({ item }: { item: SlideritemRecord }) {
  return (
    <Box data-testid={`slide-${item.id}`} bg={colors.gray[900]} paddingBottom="35px">
      <Box
        paddingLeft="50px"
        paddingRight="50px"
        backgroundRepeat="no-repeat"
        backgroundPosition="top"
        __css={{
          backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(0, 0, 0, 1)), url(${item.image?.url})`,
        }}
        height="400px"
      ></Box>
      <CircleIcon size="58px" icon={item.icon as SupportedIcons} />
      <Text margin="50px">{item.text}</Text>
    </Box>
  );
}
