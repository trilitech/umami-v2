import { GenericMenu } from "./GenericMenu";
import { AlertCircleIcon, LockIcon, RadioIcon } from "../../assets/icons";

const menuItems = [
  [
    {
      label: "Change Password",
      icon: <LockIcon />,
      onClick: () => {},
      hasArrow: true,
    },
    { label: "Network", icon: <RadioIcon />, onClick: () => {}, hasArrow: true },
  ],
  [
    {
      label: "Error Logs",
      icon: <AlertCircleIcon />,
      onClick: () => {},
    },
  ],
];

export const AdvancedMenu = () => <GenericMenu menuItems={menuItems} title="Advanced" />;
