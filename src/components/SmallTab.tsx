import { Tab, TabProps } from "@chakra-ui/react";
import React, { ReactNode } from "react";

const SmallTab: React.FC<{ children: ReactNode } & TabProps> = ({ children, ...props }) => {
  return (
    <Tab {...props} fontSize="sm" paddingX={3}>
      {children}
    </Tab>
  );
};

export default SmallTab;
