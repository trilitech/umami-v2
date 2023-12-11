import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Center, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

import { CircleIcon } from "./CircleIcon";

export type Item = {
  id: number;
  text: ReactNode;
  icon: ReactNode;
  image: string;
};

export const SlideItem = ({ item }: { item: Item }) => {
  return (
    <Box
      height="730px"
      paddingTop="500px"
      paddingBottom="35px"
      backgroundImage={item.image}
      backgroundSize="contain"
      backgroundRepeat="no-repeat"
      data-testid={`slide-${item.id}`}
    >
      <Center flexDirection="column" paddingBottom="50px">
        <CircleIcon icon={item.icon} size="58px" />
        <Text width="400px" margin="16px 50px 0 50px">
          {item.text}
        </Text>
      </Center>
    </Box>
  );
};
