import { Card } from "@chakra-ui/react";

import { HeaderActions } from "./HeaderActions";
import { LogoIcon } from "../../assets/icons/logo";

export const Header = () => (
  <Card justifyContent="space-between" padding="10px 20px" borderRadius="100px">
    <LogoIcon width="48px" height="48px" />
    <HeaderActions />
  </Card>
);
