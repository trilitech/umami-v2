import { Switch } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/system";
import { useDynamicDrawerContext, useDynamicModalContext } from "@umami/components";
import { downloadBackupFile } from "@umami/state";

import { AddressBookMenu } from "./AddressBookMenu/AddressBookMenu";
import { AdvancedMenu } from "./AdvancedMenu/AdvancedMenu";
import { AppsMenu } from "./AppsMenu/AppsMenu";
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
import { OnboardOptionsModal } from "../Onboarding/OnboardOptions";
import { useCheckVerified } from "../Onboarding/useCheckUnverified";

export const Menu = () => {
  const { openWith: openModal } = useDynamicModalContext();
  const { openWith: openDrawer } = useDynamicDrawerContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const isVerified = useCheckVerified();

  const colorModeSwitchLabel = colorMode === "light" ? "Light mode" : "Dark mode";

  const menuItemsForVerifiedUser = [
    {
      label: "Address Book",
      icon: <BookIcon />,
      onClick: () => openDrawer(<AddressBookMenu />),
      hasArrow: true,
    },
    {
      label: "Add Account",
      icon: <UserPlusIcon />,
      onClick: () => openModal(<OnboardOptionsModal />),
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
  ];

  const menuItems = [
    [
      {
        label: "Advanced",
        icon: <SettingsIcon />,
        onClick: () => openDrawer(<AdvancedMenu />),
        hasArrow: true,
      },
      ...(isVerified ? menuItemsForVerifiedUser : []),
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

  return <GenericMenu menuItems={menuItems} />;
};
