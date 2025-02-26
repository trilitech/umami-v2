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
import hj from "@hotjar/browser";
import { useImplicitAccounts } from "@umami/state";

import { ImportBackupTab } from "./ImportBackupTab";
import { LedgerTab } from "./LedgerTab";
import { SecretKeyTab } from "./SecretKeyTab";
import { SeedPhraseTab } from "./SeedPhraseTab";
import { LoginIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalCloseButton } from "../../CloseButton";
import { TabSwitch } from "../../TabSwitch/TabSwitch";

const BEFORE_ONBOARDING_OPTIONS = ["Seed phrase", "Secret key", "Backup"];
const AFTER_ONBOARDING_OPTIONS = ["Seed phrase", "Secret key", "Ledger"];

export const ImportWallet = () => {
  const color = useColor();
  const hasOnboarded = useImplicitAccounts().length > 0;

  hj.stateChange("importWallet");

  return (
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
        <Center flexDirection="row" gap="16px">
          <Icon as={LoginIcon} width="24px" height="24px" color={color("400")} />
          <Heading size="xl">Import wallet</Heading>
        </Center>
      </ModalHeader>

      <ModalBody>
        <Tabs isLazy variant="onboarding">
          <TabSwitch
            options={hasOnboarded ? AFTER_ONBOARDING_OPTIONS : BEFORE_ONBOARDING_OPTIONS}
          />

          <TabPanels padding="20px 0 0 0">
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

            {hasOnboarded && (
              <TabPanel>
                <LedgerTab />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </ModalBody>
    </ModalContent>
  );
};
