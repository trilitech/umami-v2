import { type ReactElement } from "react";

export type TMenuItem = {
  label: string;
  icon: ReactElement;
  onClick: () => Promise<void> | void;
  rightElement?: ReactElement;
  hasArrow?: boolean;
};

export type MenuItems = TMenuItem[][];
