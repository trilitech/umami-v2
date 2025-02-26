import { Switch } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/system";
import hj from "@hotjar/browser";
import { useDynamicDrawerContext, useDynamicModalContext } from "@umami/components";

import { AddressBookMenu } from "./AddressBookMenu/AddressBookMenu";
import { AdvancedMenu } from "./AdvancedMenu/AdvancedMenu";
import { AppsMenu } from "./AppsMenu/AppsMenu";
import { GenericMenu } from "./GenericMenu";
import { LogoutModal } from "./LogoutModal";
import { useSaveBackup } from "./useSaveBackup";
import {
  BookIcon,
  CodeSandboxIcon,
  DownloadIcon,
  LogoutIcon,
  MoonIcon,
  SettingsIcon,
  UserPlusIcon,
} from "../../assets/icons";
import { OnboardOptionsModal } from "../Onboarding/OnboardOptions";
import { useHasVerifiedAccounts } from "../Onboarding/VerificationFlow";

export const Menu = () => {
  const { openWith: openModal } = useDynamicModalContext();
  const { openWith: openDrawer } = useDynamicDrawerContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const hasVerified = useHasVerifiedAccounts();
  const saveBackup = useSaveBackup();

  const colorModeSwitchLabel = colorMode === "light" ? "Light mode" : "Dark mode";

  hj.stateChange("menu");

  const advanced = {
    label: "Advanced",
    icon: <SettingsIcon />,
    onClick: () => openDrawer(<AdvancedMenu />),
    hasArrow: true,
  };
  const addressBook = {
    label: "Address book",
    icon: <BookIcon />,
    onClick: () => openDrawer(<AddressBookMenu />),
    hasArrow: true,
  };
  const addAccount = {
    label: "Add account",
    icon: <UserPlusIcon />,
    onClick: () => openModal(<OnboardOptionsModal />),
    hasArrow: false,
  };
  const backup = {
    label: "Save backup",
    icon: <DownloadIcon />,
    onClick: saveBackup,
    hasArrow: false,
  };
  const apps = {
    label: "Apps",
    icon: <CodeSandboxIcon />,
    onClick: () => openDrawer(<AppsMenu />),
    hasArrow: true,
  };

  const coreMenuItems = hasVerified
    ? [advanced, addressBook, addAccount, backup, apps]
    : [advanced, addAccount];

  const themeMenuItems = [
    {
      label: colorModeSwitchLabel,
      icon: <MoonIcon />,
      onClick: toggleColorMode,
      rightElement: <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />,
    },
  ];

  const logoutMenuItems = [
    {
      label: "Log out",
      icon: <LogoutIcon />,
      onClick: () => openModal(<LogoutModal />),
    },
  ];

  return <GenericMenu menuItems={[coreMenuItems, themeMenuItems, logoutMenuItems]} />;
};
