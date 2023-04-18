import { Button, Divider, Heading, Text, VStack } from "@chakra-ui/react";
import { MakiLogo } from "./components/MakiLogo";
import { useCreateOrImportSecretModal } from "./components/CreateOrImportSecret/useCreateOrImportSecretModal";

function ImportSeed() {
  const { onOpen, modalElement } = useCreateOrImportSecretModal();
  return (
    <VStack>
      <MakiLogo />
      <Heading size={"3xl"}>Welcome to Umami</Heading>
      <Divider />
      <Text size="lg" color="umami.gray.450">
        A powerfull Tezos wallet
      </Text>
      <Button onClick={onOpen} bg={"umami.blue"}>
        Get started
      </Button>
      {modalElement}
    </VStack>
  );
}

export default ImportSeed;
