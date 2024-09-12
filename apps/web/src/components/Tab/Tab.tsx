import { Tab as ChakraTab } from "@chakra-ui/react";
import { NavLink, useMatch } from "react-router-dom";

import { useColor } from "../../styles/useColor";

type TabProps = {
  to: string;
  label: string;
};

export const Tab = ({ to, label }: TabProps) => {
  const isActive = useMatch(to);
  const color = useColor();

  return (
    <ChakraTab
      as={NavLink}
      width="full"
      to={to}
      {...(isActive && {
        bg: color("100"),
        color: color("900"),
      })}
    >
      {label}
    </ChakraTab>
  );
};
