import { useDynamicDrawerContext } from "@umami/components";

import { GenericMenu } from "./GenericMenu";
import { NetworkMenu } from "./NetworkMenu";
import { AlertCircleIcon, LockIcon, RadioIcon } from "../../assets/icons";

export const AdvancedMenu = () => {
  const { openWith } = useDynamicDrawerContext();

  const menuItems = [
    [
      {
        label: "Change Password",
        icon: <LockIcon />,
        onClick: () => {},
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
        onClick: () => {},
      },
    ],
  ];

  return <GenericMenu menuItems={menuItems} title="Advanced" />;
};
