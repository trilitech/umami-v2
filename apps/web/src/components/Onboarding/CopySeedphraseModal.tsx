import {
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";

import { CopyIcon, KeyIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";
import { CopyButton } from "../CopyButton";

type CopySeedphraseModalProps = {
  seedPhrase: string;
};

export const CopySeedphraseModal = ({ seedPhrase }: CopySeedphraseModalProps) => {
  const color = useColor();
  const words = seedPhrase.split(" ");

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="12px">
          <Icon as={KeyIcon} width="24px" height="24px" marginBottom="4px" color={color("blue")} />
          <Heading size="xl">Import Wallet</Heading>
          <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
            Record these 24 words in order to restore your wallet in the future
          </Text>
        </Center>
      </ModalHeader>

      <ModalBody>
        <Grid gridRowGap="16px" gridColumnGap="12px" gridTemplateColumns="repeat(3, 1fr)">
          {words.map((word, index) => (
            <GridItem
              key={index}
              as={Flex}
              alignItems="center"
              gap="8px"
              padding="12px 16px"
              borderWidth="1.5px"
              borderStyle="dashed"
              borderColor={color("300")}
              borderRadius="full"
            >
              <Text color={color("300")} fontSize="lg">
                {String(index + 1).padStart(2, "0")}.
              </Text>
              <Text fontSize="lg" fontWeight="medium">
                {word}
              </Text>
            </GridItem>
          ))}
        </Grid>
        <CopyButton width="full" marginTop="16px" value={seedPhrase} variant="ghost">
          <Icon as={CopyIcon} />
          Copy
        </CopyButton>
      </ModalBody>
      <ModalFooter>
        <Button width="full" variant="primary">
          Next
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
