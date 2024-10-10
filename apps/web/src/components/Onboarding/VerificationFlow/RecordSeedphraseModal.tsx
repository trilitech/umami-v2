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

import { VerifySeedphraseModal } from "./VerifySeedphraseModal";
import { CopyIcon, KeyIcon } from "../../../assets/icons";
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
          gridRowGap="16px"
          gridColumnGap={{ base: "8px", md: "12px" }}
          gridTemplateColumns="repeat(3, 1fr)"
        >
          {words.map((word, index) => (
            <MnemonicWord
              key={index}
              as={Flex}
              height={{ md: "48px", base: "34px" }}
              color="black"
              border="1px solid"
              borderWidth="1.5px"
              borderStyle="dashed"
              borderColor={color("300")}
              borderRadius="full"
              index={index}
              word={word}
            />
          ))}
        </Grid>
        <CopyButton width="full" marginTop="16px" value={seedPhrase} variant="ghost">
          <Icon as={CopyIcon} />
          Copy
        </CopyButton>
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
