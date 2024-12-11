import {
  Button,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

import { EyeIcon, EyeSlashIcon, FileCopyIcon, KeyIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { type OnboardingStep, type ShowSeedphraseStep } from "../OnboardingStep";

const COPY_TIMEOUT = 30_000;
const COPIED_POPUP_DURATION = 2000;

export const ShowSeedphrase = ({
  goToStep,
  account,
}: {
  goToStep: (step: OnboardingStep) => void;
  account: ShowSeedphraseStep["account"];
}) => {
  const [isHidden, setIsHidden] = useState(true);
  const {
    isOpen: isPopoverOpen,
    onOpen: setIsPopoverOpen,
    onClose: setIsPopoverClose,
  } = useDisclosure();

  const handleCopy = () => {
    window.electronAPI.clipboardWriteText(account.mnemonic);
    setIsPopoverOpen();

    setTimeout(() => {
      setIsPopoverClose();
    }, COPIED_POPUP_DURATION);

    setTimeout(() => {
      window.electronAPI.clipboardClear();
    }, COPY_TIMEOUT);
  };

  return (
    <ModalContentWrapper
      icon={<KeyIcon width="24px" height="24px" />}
      subtitle="Please record the following 24 words in sequence in order to restore it in the future."
      title="Record Seed Phrase"
    >
      <VStack>
        <SimpleGrid userSelect="none" columns={3} spacing={2}>
          {account.mnemonic.split(" ").map((item, index) => (
            <Flex
              key={index}
              width="126px"
              padding="6px"
              border="1px dashed"
              borderColor={colors.gray[500]}
              borderRadius="4px"
            >
              <Heading
                width="18px"
                marginRight="10px"
                paddingTop="2px"
                color={colors.gray[450]}
                textAlign="right"
                size="sm"
              >
                {index + 1}
              </Heading>
              <Text
                sx={{
                  WebkitTextSecurity: isHidden ? "disc" : "none",
                }}
                data-testid={`mnemonic-word-${index}`}
                size="sm"
              >
                {isHidden ? "********" : item}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
        <Flex justifyContent="space-between" gap="16px" width="100%" marginTop="20px">
          <Button
            width="100%"
            data-testid="show-seedphrase-button"
            leftIcon={isHidden ? <EyeSlashIcon /> : <EyeIcon />}
            onClick={() => setIsHidden(!isHidden)}
            variant="outline"
          >
            {isHidden ? "Show" : "Hide"} seed phrase
          </Button>
          <Popover autoFocus={false} closeOnBlur={false} isOpen={isPopoverOpen}>
            <PopoverTrigger>
              <Button
                width="100%"
                leftIcon={<FileCopyIcon stroke={colors.gray[450]} />}
                onClick={handleCopy}
                variant="outline"
              >
                Copy to clipboard
              </Button>
            </PopoverTrigger>
            <PopoverContent maxWidth="max-content" background="white">
              <PopoverArrow background="white !important" />
              <PopoverBody padding="8px 12px">
                <Text color="black" fontWeight="medium" size="sm">
                  Copied!
                </Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
        <Button
          width="100%"
          marginTop="8px"
          onClick={_ => {
            goToStep({ type: "verifySeedphrase", account });
          }}
          size="lg"
        >
          OK, I've recorded it
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};
