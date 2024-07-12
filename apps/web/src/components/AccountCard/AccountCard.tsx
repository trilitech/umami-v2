import { Card } from "@chakra-ui/react";
import { useAppSelector } from "@umami/state";

import { AccountBalance } from "./AccountBalance";
import { AccountSelector } from "./AccountSelector";

export const AccountCard = () => {
  const accounts = useAppSelector(s => s.accounts.items);

  return (
    <Card
      gap={{
        base: "16px",
        lg: "20px",
      }}
      padding="8px 8px 20px 8px"
      borderRadius="40px"
    >
      <AccountSelector
        account={{
          name: accounts[0].label,
          pkh: accounts[0].address.pkh,
          address: accounts[0].address,
        }}
        highlighted
      />
      <AccountBalance />
    </Card>
  );
};
