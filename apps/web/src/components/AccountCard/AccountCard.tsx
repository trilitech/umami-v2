import { Card } from "@chakra-ui/react";

import { AccountBalance } from "./AccountBalance";
import { AccountSelector } from "./AccountSelector";

export const AccountCard = () => (
  <Card
    gap={{
      base: "16px",
      lg: "20px",
    }}
    padding="8px 8px 20px 8px"
    borderRadius="40px"
  >
    <AccountSelector />
    <AccountBalance />
  </Card>
);
