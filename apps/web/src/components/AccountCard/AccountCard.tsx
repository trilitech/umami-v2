import { Card, IconButton } from "@chakra-ui/react";
import { useAppSelector } from "@umami/state";

import { AccountBalance } from "./AccountBalance";
import { AccountSelector } from "./AccountSelector";
import { ChevronDownIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const AccountCard = () => {
  const color = useColor();
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
        account={accounts[0]}
        highlighted
        sideElement={
          <IconButton
            width="fit-content"
            marginLeft="auto"
            aria-label="Account Selector"
            icon={<ChevronDownIcon color={color("500")} />}
            variant="empty"
          />
        }
      />
      <AccountBalance />
    </Card>
  );
};
