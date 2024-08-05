export type TMenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick: (value?: any) => Promise<void> | void;
  rightElement?: React.ReactNode;
  hasArrow?: boolean;
};

export type MenuItems = TMenuItem[][];
