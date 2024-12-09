import {
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useState } from "react";

import { VerifySeedphraseModal } from "./VerifySeedphraseModal";
import { CopyIcon, EyeIcon, EyeOffIcon, KeyIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalBackButton } from "../../BackButton";
import { ModalCloseButton } from "../../CloseButton";
import { CopyButton } from "../../CopyButton";
import { MnemonicWord } from "../../MnemonicWord";

type CopySeedphraseModalProps = {
  seedPhrase: string;
};

export const RecordSeedphraseModal = ({ seedPhrase }: CopySeedphraseModalProps) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();
  const words = seedPhrase.split(" ");
  const [isHidden, setIsHidden] = useState(true);

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="12px">
          <Icon as={KeyIcon} boxSize="24px" marginBottom="4px" color={color("400")} />
          <Heading size="xl">Record Seed Phrase</Heading>
          <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
            Record these 24 words in order to restore your wallet in the future
          </Text>
        </Center>
      </ModalHeader>

      <ModalBody>
        <Grid
          gridRowGap={{ base: "12px", md: "18px" }}
          gridColumnGap={{ base: "8px", md: "12px" }}
          gridTemplateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }}
          userSelect="none"
        >
          {words.map((word, index) => (
            <MnemonicWord
              key={index}
              as={Flex}
              alignItems="center"
              gap="7px"
              height={{ md: "48px", base: "34px" }}
              padding={{ base: "10px 12px", md: "10px 14px" }}
              color="black"
              fontSize="14px"
              border="1px solid"
              borderWidth="1.5px"
              borderStyle="dashed"
              borderColor={color("100")}
              borderRadius="full"
              index={index}
              isHidden={isHidden}
              word={word}
            />
          ))}
        </Grid>
        <Flex gap="16px" width="100%" marginTop="16px">
          <Button
            gap="4px"
            display="flex"
            width="full"
            fontSize="14px"
            fontWeight="400"
            leftIcon={
              <Icon as={isHidden ? EyeOffIcon : EyeIcon} boxSize="18px" color={color("400")} />
            }
            onClick={() => setIsHidden(!isHidden)}
            variant="ghost"
          >
            {isHidden ? "Show" : "Hide"} seed phrase
          </Button>
          <CopyButton
            gap="8px"
            width="full"
            fontSize="14px"
            isDisposable
            value={seedPhrase}
            variant="ghost"
          >
            <Icon as={CopyIcon} boxSize="18px" color={color("400")} />
            Copy
          </CopyButton>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Button
          width="full"
          onClick={() =>
            openWith(<VerifySeedphraseModal seedPhrase={seedPhrase} />, { size: "xl" })
          }
          variant="primary"
        >
          Next
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
