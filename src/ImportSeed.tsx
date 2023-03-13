import { restoreAccount } from "./utils/restoreAccounts";

import makiLogo from "./assets/maki-default.png";

import {
  Button,
  Center,
  Heading,
  Textarea,
  useToast,
  VStack,
  Image,
} from "@chakra-ui/react";
const seedPhrase =
  "glory city income swallow act garment novel fringe bread chaos club dolphin when live penalty mirror donate razor dad eyebrow powder trumpet bunker wine";

function ImportSeed() {
  const toast = useToast();

  const restore = async () => {
    const account = await restoreAccount(seedPhrase);
    toast({ title: "Accounts restored!", description: account.pkh });
  };

  return (
    <Center>
      <VStack width={300}>
        <Image
          boxSize="100px"
          objectFit="cover"
          src={makiLogo}
          alt="Maki logo"
        />
        <Heading>Restore Accounts</Heading>
        <Textarea placeholder="Enter your seed phrase..." />
        <Button onClick={(_) => restore()} title="Restore accounts">
          Restore accounts
        </Button>
      </VStack>
    </Center>
  );
}

export default ImportSeed;
