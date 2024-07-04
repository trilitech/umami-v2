import { Tab, type TabProps } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

export const SmallTab = ({ children, ...props }: PropsWithChildren<TabProps>) => (
  <Tab {...props} fontSize="sm" paddingX="12px">
    {children}
  </Tab>
);
