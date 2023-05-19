import {
  Box,
  Button,
  Divider,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Center,
} from "@chakra-ui/react";
import { MakiLogo } from "./components/MakiLogo";
import Slider1 from "./assets/onboarding/slider_1.png";
import { SupportedIcons } from "./components/CircleIcon";
import Slider from "./components/Slider";
import SlideItem from "./components/SliderItem";
import { useCreateOrImportSecretModal } from "./components/Onboarding/useOnboardingModal";

function ImportSeed() {
  const { onOpen, modalElement } = useCreateOrImportSecretModal();
  // const { onOpen: onOpenEula, modalElement: eulaModalElement } = useEulaModal({onContinue: onOpenSecret});
  // TODO: Fill with proper content
  const sliderItems = [
    {
      src: Slider1,
      text: "Manage your NFTs and integrate with dApps",
      icon: SupportedIcons.diamont,
    },
    {
      src: Slider1,
      text: "Test",
      icon: SupportedIcons.document,
    },
    {
      src: Slider1,
      text: "Test 2",
      icon: SupportedIcons.document,
    },
  ];
  return (
    <Box bg={"umami.gray.900"} height={"100vh"} padding={"60px"}>
      <SimpleGrid
        bg={"umami.gray.700"}
        columns={[1, 1, 2]}
        borderRadius={"30px"}
      >
        <Center>
          <VStack spacing={"16px"} maxW={"400px"} padding={"32px"}>
            <MakiLogo size={"48px"} />
            <Heading size={"3xl"}>Welcome to Umami</Heading>
            <Divider maxWidth={"400px"} />
            <Text color="umami.gray.450">A powerfull Tezos wallet</Text>
            <Button width={"340px"} onClick={onOpen} bg={"umami.blue"}>
              Get started
            </Button>
            <Text color="umami.gray.400">Umami v2.0.0</Text>
            {modalElement}
          </VStack>
        </Center>
        <Box
          width={"100%"}
          borderTopRightRadius={"30px"}
          borderBottomRightRadius={"30px"}
          height="100%"
          overflow="hidden"
          bg="black"
          display={["none", "none", "initial"]}
        >
          <Slider>
            {sliderItems.map((item, index) => {
              return <SlideItem key={index} {...item} />;
            })}
          </Slider>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export default ImportSeed;
