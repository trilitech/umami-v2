import { type ButtonProps } from "@chakra-ui/react";
import { type ReactElement } from "react";

export type TMenuItem = {
  label: string;
  icon: ReactElement;
  onClick: () => Promise<void> | void;
  rightElement?: ReactElement;
  hasArrow?: boolean;
} & ButtonProps;

export type MenuItems = TMenuItem[][];
