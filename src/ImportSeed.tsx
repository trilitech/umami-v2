import { Box, Button, Divider, Heading, SimpleGrid, Text, VStack, Center } from "@chakra-ui/react";
import { MakiLogo } from "./components/MakiLogo";
import Slider from "./components/Slider";
import SlideItem from "./components/SliderItem";
import { useCreateOrImportSecretModal } from "./components/Onboarding/useOnboardingModal";
import { AllSlideritemsDocument, SlideritemRecord } from "./graphql/generated";
import { request } from "./utils/datocms/request";
import { useEffect, useState } from "react";

function ImportSeed() {
  const { onOpen, modalElement } = useCreateOrImportSecretModal();

  const [slideItems, setSlideItems] = useState<SlideritemRecord[]>([]);
  const requestSliderItems = async () => {
    const result = await request(AllSlideritemsDocument);
    setSlideItems(result.allSlideritems as SlideritemRecord[]);
  };

  useEffect(() => {
    requestSliderItems();
  }, []);

  return (
    <Box bg="umami.gray.900" height="100vh" padding="60px">
      <SimpleGrid bg="umami.gray.700" columns={[1, 1, 2]} borderRadius="30px">
        <Center>
          <VStack spacing="16px" maxW="400px" padding="32px">
            <MakiLogo size="48px" />
            <Heading size="3xl">Welcome to Umami</Heading>
            <Divider maxWidth="400px" />
            <Text color="umami.gray.450">A powerfull Tezos wallet</Text>
            <Button width="340px" onClick={onOpen} bg="umami.blue">
              Get started
            </Button>
            <Text color="umami.gray.400">Umami v2.0.0</Text>
            {modalElement}
          </VStack>
        </Center>
        <Box
          width="100%"
          borderTopRightRadius="30px"
          borderBottomRightRadius="30px"
          height="100%"
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
    </Box>
  );
}

export default ImportSeed;
