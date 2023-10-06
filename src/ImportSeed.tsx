import { Box, Button, Divider, Heading, SimpleGrid, Text, VStack, Center } from "@chakra-ui/react";
import { MakiLogo } from "./components/MakiLogo";
import Slider from "./components/Slider";
import SlideItem from "./components/SliderItem";
import { useOnboardingModal } from "./components/Onboarding/useOnboardingModal";
import { AllSlideritemsDocument, SlideritemRecord } from "./graphql/generated";
import { request } from "./utils/datocms/request";
import { useEffect, useState } from "react";
import colors from "./style/colors";
import { AppVersion } from "./components/AppVersion";
import BackgroundImage from "./assets/onboarding/background_image.png";

function ImportSeed() {
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
    <Center bgImage={BackgroundImage} bgSize="cover" height="100vh" padding="60px">
      {showSlider && (
        <SimpleGrid bg={colors.gray[800]} columns={[1, 1, 2]} borderRadius="30px">
          <Center>
            <VStack spacing="0" maxW="400px" padding="32px">
              <MakiLogo size="48px" mb="24px" />
              <Heading size="3xl" mb="16px">
                Welcome to Umami
              </Heading>
              <Divider maxWidth="400px" mb="16px" />
              <Text color={colors.gray[450]} mb="32px">
                A powerful Tezos wallet
              </Text>
              <Button w="100%" size="lg" mb="24px" onClick={openModal}>
                Get started
              </Button>
              <AppVersion fontSize="13px" />
            </VStack>
          </Center>
          <Box
            width="100%"
            borderTopRightRadius="30px"
            borderBottomRightRadius="30px"
            height="665px"
            overflow="hidden"
            bg="black"
            display={["none", "none", "initial"]}
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

export default ImportSeed;
