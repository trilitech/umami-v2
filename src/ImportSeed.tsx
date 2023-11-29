import { Box, Button, Center, Divider, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import BackgroundImage from "./assets/onboarding/background_image.png";
import { AppVersion } from "./components/AppVersion";
import { MakiLogo } from "./components/MakiLogo";
import { useOnboardingModal } from "./components/Onboarding/useOnboardingModal";
import { Slider } from "./components/Slider";
import { SlideItem } from "./components/SliderItem";
import { AllSlideritemsDocument, SlideritemRecord } from "./graphql/generated";
import colors from "./style/colors";
import { request } from "./utils/datocms/request";

export function ImportSeed() {
  const [showSlider, setShowSlider] = useState(true);
  const { onOpen, modalElement } = useOnboardingModal(() => setShowSlider(true));
  const openModal = () => {
    setShowSlider(false);
    onOpen();
  };
  const [slideItems, setSlideItems] = useState<SlideritemRecord[]>([]);
  const requestSliderItems = async () => {
    const result = await request(AllSlideritemsDocument);
    setSlideItems(result.allSlideritems as SlideritemRecord[]);
  };

  useEffect(() => {
    requestSliderItems();
  }, []);

  return (
    <Center height="100vh" padding="60px" backgroundImage={BackgroundImage} backgroundSize="cover">
      {showSlider && (
        <SimpleGrid background={colors.gray[800]} borderRadius="30px" columns={[1, 1, 2]}>
          <Center>
            <VStack maxWidth="400px" padding="32px" spacing="0">
              <MakiLogo marginBottom="24px" size="48px" />
              <Heading marginBottom="16px" size="3xl">
                Welcome to Umami
              </Heading>
              <Divider maxWidth="400px" marginBottom="16px" />
              <Text marginBottom="32px" color={colors.gray[450]}>
                A powerful Tezos wallet
              </Text>
              <Button width="100%" marginBottom="24px" onClick={openModal} size="lg">
                Get started
              </Button>
              <AppVersion fontSize="13px" />
            </VStack>
          </Center>
          <Box
            display={["none", "none", "initial"]}
            overflow="hidden"
            width="100%"
            height="665px"
            background="black"
            borderTopRightRadius="30px"
            borderBottomRightRadius="30px"
          >
            <Slider>
              {slideItems.map((item, index) => {
                return <SlideItem key={index} item={item} />;
              })}
            </Slider>
          </Box>
        </SimpleGrid>
      )}
      {modalElement}
    </Center>
  );
}
