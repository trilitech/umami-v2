import { Switch } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/system";
import { useDynamicDrawerContext, useDynamicModalContext } from "@umami/components";
import { downloadBackupFile } from "@umami/state";

import { AddressBookMenu } from "./AddressBookMenu";
import { AdvancedMenu } from "./AdvancedMenu";
import { AppsMenu } from "./AppsMenu";
import { GenericMenu } from "./GenericMenu";
import { LogoutModal } from "./LogoutModal";
import {
  BookIcon,
  CodeSandboxIcon,
  DownloadIcon,
  LogoutIcon,
  MoonIcon,
  SettingsIcon,
  UserPlusIcon,
} from "../../assets/icons";
import { useOnboardingModal } from "../Onboarding/useOnboardingModal";

export const Menu = () => {
  const { openWith: openModal } = useDynamicModalContext();
  const { openWith: openDrawer } = useDynamicDrawerContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const { onOpen: openOnboardingModal, modalElement } = useOnboardingModal();

  const colorModeSwitchLabel = colorMode === "light" ? "Light mode" : "Dark mode";

  const menuItems = [
    [
      {
        label: "Advanced",
        icon: <SettingsIcon />,
        onClick: () => openDrawer(<AdvancedMenu />),
        hasArrow: true,
      },
      {
        label: "Address Book",
        icon: <BookIcon />,
        onClick: () => openDrawer(<AddressBookMenu />),
        hasArrow: true,
      },
      {
        label: "Add Account",
        icon: <UserPlusIcon />,
        onClick: openOnboardingModal,
      },
      {
        label: "Save Backup",
        icon: <DownloadIcon />,
        onClick: downloadBackupFile,
      },
      {
        label: "Apps",
        icon: <CodeSandboxIcon />,
        onClick: () => openDrawer(<AppsMenu />),
        hasArrow: true,
      },
    ],
    [
      {
        label: colorModeSwitchLabel,
        icon: <MoonIcon />,
        onClick: toggleColorMode,
        rightElement: <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />,
      },
    ],
    [
      {
        label: "Logout",
        icon: <LogoutIcon />,
        onClick: () => openModal(<LogoutModal />),
      },
    ],
  ];

  return (
    <>
      <GenericMenu menuItems={menuItems} />
      {modalElement}
    </>
  );
};
