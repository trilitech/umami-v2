import { Tab as ChakraTab } from "@chakra-ui/react";
import { NavLink, useMatch } from "react-router-dom";

type TabProps = {
  to: string;
  label: string;
};

export const Tab = ({ to, label }: TabProps) => {
  const isActive = useMatch(to);

  return (
    <ChakraTab
      as={NavLink}
      width="full"
      to={to}
      {...(isActive && {
        bg: "gray.200",
        color: "gray.900",
      })}
    >
      {label}
    </ChakraTab>
  );
};
