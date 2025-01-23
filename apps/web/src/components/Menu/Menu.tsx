import { Switch } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/system";
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
import { useIsAccountVerified } from "../Onboarding/VerificationFlow";

export const Menu = () => {
  const { openWith: openModal } = useDynamicModalContext();
  const { openWith: openDrawer } = useDynamicDrawerContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const isVerified = useIsAccountVerified();
  const saveBackup = useSaveBackup();

  const colorModeSwitchLabel = colorMode === "light" ? "Light mode" : "Dark mode";

  const menuItemsForVerifiedUser = [
    {
      label: "Address book",
      icon: <BookIcon />,
      onClick: () => openDrawer(<AddressBookMenu />),
      hasArrow: true,
    },
    {
      label: "Add account",
      icon: <UserPlusIcon />,
      onClick: () => openModal(<OnboardOptionsModal />),
    },
    {
      label: "Save backup",
      icon: <DownloadIcon />,
      onClick: saveBackup,
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
        label: "Log out",
        icon: <LogoutIcon />,
        onClick: () => openModal(<LogoutModal />),
      },
    ],
  ];

  return <GenericMenu menuItems={menuItems} />;
};
