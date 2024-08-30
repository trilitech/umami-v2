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
import { useImplicitAccounts } from "@umami/state";

import { ImportBackupTab } from "./ImportBackupTab";
import { LedgerTab } from "./LedgerTab";
import { SecretKeyTab } from "./SecretKeyTab";
import { SeedPhraseTab } from "./SeedPhraseTab";
import { LoginIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalCloseButton } from "../../CloseButton";
import { TabSwitch } from "../../TabSwitch/TabSwitch";

const BEFORE_ONBOARDING_OPTIONS = ["Seed Phrase", "Secret Key", "Backup", "Ledger"];
const AFTER_ONBOARDING_OPTIONS = ["Seed Phrase", "Secret Key", "Ledger"];

export const ImportWallet = () => {
  const color = useColor();
  const hasOnboarded = useImplicitAccounts().length > 0;

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
        <Tabs isLazy variant="onboarding">
          <TabSwitch
            options={hasOnboarded ? AFTER_ONBOARDING_OPTIONS : BEFORE_ONBOARDING_OPTIONS}
          />

          <TabPanels padding="30px 0 0 0">
            <TabPanel>
              <SeedPhraseTab />
            </TabPanel>

            <TabPanel>
              <SecretKeyTab />
            </TabPanel>

            {!hasOnboarded && (
              <TabPanel>
                <ImportBackupTab />
              </TabPanel>
            )}

            <TabPanel>
              <LedgerTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>
    </ModalContent>
  );
};
