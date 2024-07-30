import { Card, IconButton } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useCurrentAccount } from "@umami/state";

import { AccountBalance } from "./AccountBalance";
import { SelectorIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AccountSelectorModal } from "../AccountSelectorModal";
import { AccountTile } from "../AccountTile";

export const AccountCard = () => {
  const color = useColor();
  const currentAccount = useCurrentAccount()!;
  const { openWith } = useDynamicModalContext();

  return (
    <Card
      gap={{
        base: "16px",
        lg: "20px",
      }}
      padding="8px 8px 20px 8px"
      borderRadius="40px"
    >
      <AccountTile
        background={color("50")}
        account={currentAccount}
        onClick={() => openWith(<AccountSelectorModal />)}
      >
        <IconButton
          alignSelf="center"
          width="fit-content"
          marginLeft="auto"
          aria-label="Account Selector"
          icon={<SelectorIcon color={color("400")} />}
          size="xs"
          variant="empty"
        />
      </AccountTile>
      <AccountBalance />
    </Card>
  );
};
