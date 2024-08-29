import { useDynamicDrawerContext } from "@umami/components";

import { AlertCircleIcon, LockIcon, RadioIcon } from "../../../assets/icons";
import { useCheckVerified } from "../../Onboarding/useCheckUnverified";
import { ChangePasswordMenu } from "../ChangePasswordMenu/ChangePasswordMenu";
import { ErrorLogsMenu } from "../ErrorLogsMenu/ErrorLogsMenu";
import { GenericMenu } from "../GenericMenu";
import { NetworkMenu } from "../NetworkMenu/NetworkMenu";

export const AdvancedMenu = () => {
  const { openWith } = useDynamicDrawerContext();
  const isVerified = useCheckVerified();

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
        label: "Change Password",
        icon: <LockIcon />,
        onClick: () => openWith(<ChangePasswordMenu />),
        hasArrow: true,
      },
      ...(isVerified ? menuItemsForVerifiedUser : []),
    ],
    [
      {
        label: "Error Logs",
        icon: <AlertCircleIcon />,
        onClick: () => openWith(<ErrorLogsMenu />),
      },
    ],
  ];

  return <GenericMenu menuItems={menuItems} title="Advanced" />;
};
