import { Tab, type TabProps } from "@chakra-ui/react";
import type React from "react";
import { type ReactNode } from "react";

export const SmallTab: React.FC<{ children: ReactNode } & TabProps> = ({ children, ...props }) => (
  <Tab {...props} fontSize="sm" paddingX={3}>
    {children}
  </Tab>
);
