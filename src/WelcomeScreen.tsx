import { Box, Button, Center, Divider, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { BatchIcon, KeyIcon, SlidersIcon } from "./assets/icons";
import AccountsImage from "./assets/onboarding/accounts.png";
import BackgroundImage from "./assets/onboarding/background_image.png";
import BatchImage from "./assets/onboarding/batch.png";
import MultisigImage from "./assets/onboarding/multisig.png";
import { AppVersion } from "./components/AppVersion";
import { MakiLogo } from "./components/MakiLogo";
import { useOnboardingModal } from "./components/Onboarding/useOnboardingModal";
import { Slider } from "./components/Slider";
import { Item, SlideItem } from "./components/SliderItem";
import colors from "./style/colors";

export const WelcomeScreen = () => {
  const [showSlider, setShowSlider] = useState(true);
  const { onOpen, modalElement } = useOnboardingModal(() => setShowSlider(true));
  const openModal = () => {
    setShowSlider(false);
    onOpen();
  };

  const sliderItems: Item[] = [
    {
      id: 1,
      text: (
        <>
          <Text as="span" fontWeight={600} size="md">
            Streamline asset management:&nbsp;
          </Text>
          <Text as="span" size="md">
            one mnemonic, multiple accounts, full control.
          </Text>
        </>
      ),
      icon: <SlidersIcon />,
      image: AccountsImage,
    },
    {
      id: 2,
      text: (
        <>
          <Text as="span" size="md">
            Enhance security with&nbsp;
          </Text>
          <Text as="span" fontWeight={600} size="md">
            Multi-sig
          </Text>
          <Text as="span" size="md">
            , requiring multiple signatures for transaction executions.
          </Text>
        </>
      ),
      icon: <KeyIcon width="32px" height="32px" stroke={colors.gray[450]} strokeWidth="0.9" />,
      image: MultisigImage,
    },
    {
      id: 3,
      text: (
        <>
          <Text as="span" size="md">
            Utilize the&nbsp;
          </Text>
          <Text as="span" fontWeight={600} size="md">
            Batch&nbsp;
          </Text>
          <Text as="span" size="md">
            feature to bundle transactions, improving efficiency and reducing costs.
          </Text>
        </>
      ),
      icon: <BatchIcon width="32px" height="32px" strokeWidth="0.9" />,
      image: BatchImage,
    },
  ];

  return (
    <Center height="100vh" padding="60px" backgroundImage={BackgroundImage} backgroundSize="cover">
      {showSlider && (
        <Flex width="100%" maxWidth="1320px">
          <Center
            width="100%"
            maxWidth="660px"
            background={colors.gray[800]}
            borderLeftRadius="30px"
          >
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

          <Box maxWidth="660px">
            <Slider>
              {sliderItems.map(item => (
                <SlideItem key={item.id} item={item} />
              ))}
            </Slider>
          </Box>
        </Flex>
      )}
      {modalElement}
    </Center>
  );
};
