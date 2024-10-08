import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import { type PropsWithChildren, type ReactNode } from "react";

import { useColor } from "../../styles/useColor";

type ActionsDropdownProps = {
  actions: ReactNode;
};

export const ActionsDropdown = ({ actions, children }: PropsWithChildren<ActionsDropdownProps>) => {
  const color = useColor();

  return (
    <Popover variant="dropdown">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent maxWidth="204px" data-testid="popover-content">
        <PopoverBody color={color("400")}>{actions}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
