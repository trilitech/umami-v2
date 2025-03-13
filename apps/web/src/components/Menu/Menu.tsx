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
  ShieldIcon,
  SunIcon,
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

  const isLightColorMode = colorMode === "light";
  const colorModeSwitchLabel = isLightColorMode ? "Light mode" : "Dark mode";
  const ColorModeSwitchIcon = () => (isLightColorMode ? <SunIcon /> : <MoonIcon />);
  hj.stateChange("menu");

  const handleLockOut = () => {
    sessionStorage.clear();
    window.location.reload();
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
  const changePassword = {
    label: "Password",
    icon: <ShieldIcon />,
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
  const lock = {
    label: "Lock Umami",
    icon: <LockIcon />,
    onClick: handleLockOut,
  };

  const coreMenuItems = [
    addAccount,
    ...(hasVerified ? [addressBook] : []),
    changePassword,
    ...(hasVerified ? [backup] : []),
    ...(hasVerified ? [apps] : []),
    ...(isSelectedAccountVerified ? [network] : []),
    errorLogs,
  ];

  const themeMenuItems = [
    {
      label: colorModeSwitchLabel,
      icon: <ColorModeSwitchIcon />,
      onClick: toggleColorMode,
      rightElement: <Switch isChecked={isLightColorMode} onChange={toggleColorMode} />,
    },
  ];

  const logoutMenuItems = [
    ...(hasVerified ? [lock] : []),
    {
      label: "Sign Out",
      icon: <LogoutIcon />,
      onClick: () => openModal(<LogoutModal />),
    },
  ];

  const menuItems = [coreMenuItems, themeMenuItems, logoutMenuItems];

  return <GenericMenu menuItems={menuItems} />;
};
