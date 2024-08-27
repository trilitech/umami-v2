import {
  Center,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalHeader,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { ImportBackupTab } from "./ImportBackupTab";
import { SecretKeyTab } from "./SecretKeyTab";
import { SeedPhraseTab } from "./SeedPhraseTab";
import { LoginIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalCloseButton } from "../../CloseButton";
import { TabSwitch } from "../../TabSwitch/TabSwitch";

export const ImportWallet = () => {
  const color = useColor();

  return (
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
        <Center flexDirection="column" gap="16px">
          <Icon as={LoginIcon} width="24px" height="24px" color={color("blue")} />
          <Heading size="xl">Import Wallet</Heading>
        </Center>
      </ModalHeader>
      <ModalBody>
        <Tabs variant="onboarding">
          <TabSwitch options={["Seed Phrase", "Secret Key", "Backup", "Ledger"]} />

          <TabPanels padding="30px 0 0 0">
            <TabPanel>
              <SeedPhraseTab />
            </TabPanel>
            <TabPanel>
              <SecretKeyTab />
            </TabPanel>
            <TabPanel>
              <ImportBackupTab />
            </TabPanel>
            <TabPanel>Ledger</TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>
    </ModalContent>
  );
};
