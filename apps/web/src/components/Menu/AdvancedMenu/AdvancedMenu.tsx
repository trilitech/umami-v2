import Hotjar from "@hotjar/browser";
import { useDynamicDrawerContext } from "@umami/components";

import { AlertCircleIcon, LockIcon, RadioIcon } from "../../../assets/icons";
import { useIsAccountVerified } from "../../Onboarding/VerificationFlow";
import { ChangePasswordMenu } from "../ChangePasswordMenu/ChangePasswordMenu";
import { ErrorLogsMenu } from "../ErrorLogsMenu/ErrorLogsMenu";
import { GenericMenu } from "../GenericMenu";
import { NetworkMenu } from "../NetworkMenu/NetworkMenu";

export const AdvancedMenu = () => {
  const { openWith } = useDynamicDrawerContext();
  const isVerified = useIsAccountVerified();

  Hotjar.stateChange("menu/advanced");

  const menuItemsForVerifiedUser = [
    {
      label: "Network",
      icon: <RadioIcon />,
      onClick: () => openWith(<NetworkMenu />),
      hasArrow: true,
    },
  ];

  const menuItems = [
    [
      {
        label: "Change password",
        icon: <LockIcon />,
        onClick: () => openWith(<ChangePasswordMenu />),
        hasArrow: true,
      },
      ...(isVerified ? menuItemsForVerifiedUser : []),
    ],
    [
      {
        label: "Error logs",
        icon: <AlertCircleIcon />,
        onClick: () => openWith(<ErrorLogsMenu />),
      },
    ],
  ];

  return <GenericMenu menuItems={menuItems} title="Advanced" />;
};
