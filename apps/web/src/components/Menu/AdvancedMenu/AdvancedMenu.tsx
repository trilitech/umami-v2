import { useDynamicDrawerContext } from "@umami/components";

import { AlertCircleIcon, LockIcon, RadioIcon } from "../../../assets/icons";
import { ChangePasswordMenu } from "../ChangePasswordMenu/ChangePasswordMenu";
import { ErrorLogsMenu } from "../ErrorLogsMenu/ErrorLogsMenu";
import { GenericMenu } from "../GenericMenu";
import { NetworkMenu } from "../NetworkMenu/NetworkMenu";

export const AdvancedMenu = () => {
  const { openWith } = useDynamicDrawerContext();

  const menuItems = [
    [
      {
        label: "Change Password",
        icon: <LockIcon />,
        onClick: () => openWith(<ChangePasswordMenu />),
        hasArrow: true,
      },
      {
        label: "Network",
        icon: <RadioIcon />,
        onClick: () => openWith(<NetworkMenu />),
        hasArrow: true,
      },
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