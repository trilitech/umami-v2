import { Switch } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/system";
import hj from "@hotjar/browser";
import { useDynamicDrawerContext, useDynamicModalContext } from "@umami/components";
import { useDownloadBackupFile } from "@umami/state";

import { AddressBookMenu } from "./AddressBookMenu/AddressBookMenu";
import { AppsMenu } from "./AppsMenu/AppsMenu";
import { ChangePasswordMenu } from "./ChangePasswordMenu/ChangePasswordMenu";
import { GenericMenu } from "./GenericMenu";
import { LogoutModal } from "./LogoutModal";
import {
  AlertCircleIcon,
  BookIcon,
  CodeSandboxIcon,
  DownloadIcon,
  LockIcon,
  LogoutIcon,
  MoonIcon,
  RadioIcon,
  UserPlusIcon,
} from "../../assets/icons";
import { OnboardOptionsModal } from "../Onboarding/OnboardOptions";
import { useHasVerifiedAccounts, useIsAccountVerified } from "../Onboarding/VerificationFlow";
import { ErrorLogsMenu } from "./ErrorLogsMenu/ErrorLogsMenu";
import { NetworkMenu } from "./NetworkMenu/NetworkMenu";

export const Menu = () => {
  const { openWith: openModal } = useDynamicModalContext();
  const { openWith: openDrawer } = useDynamicDrawerContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const hasVerified = useHasVerifiedAccounts();
  const isSelectedAccountVerified = useIsAccountVerified();
  const saveBackup = useDownloadBackupFile();

  const colorModeSwitchLabel = colorMode === "light" ? "Light mode" : "Dark mode";

  hj.stateChange("menu");

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
  const changePassword = {
    label: "Change password",
    icon: <LockIcon />,
    onClick: () => openDrawer(<ChangePasswordMenu />),
    hasArrow: true,
  };
  const errorLogs = {
    label: "Error logs",
    icon: <AlertCircleIcon />,
    onClick: () => openDrawer(<ErrorLogsMenu />),
  };
  const network = {
    label: "Network",
    icon: <RadioIcon />,
    onClick: () => openDrawer(<NetworkMenu />),
    hasArrow: true,
  };

  const menuItemsIfSectedAccountIsVerified = isSelectedAccountVerified ? [network] : [];
  const menuItemsHasAVerifiedAccount = hasVerified ? [addressBook, backup, apps] : [];
  const coreMenuItems = [
    addAccount,
    changePassword,
    errorLogs,
    ...menuItemsIfSectedAccountIsVerified,
    ...menuItemsHasAVerifiedAccount,
  ];

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
