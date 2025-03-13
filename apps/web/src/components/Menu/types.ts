import { type StyleProps } from "@chakra-ui/react";
import { type ReactElement } from "react";

export type TMenuItem = {
  label: string;
  icon: ReactElement;
  onClick: () => Promise<void> | void;
  rightElement?: ReactElement;
  hasArrow?: boolean;
  style?: StyleProps;
};

export type MenuItems = TMenuItem[][];
