import { XStack } from "tamagui";

import { AccountBadge } from "../accountBadge";
import { HeaderIcon } from "../headerIcon";

export const HeaderComponent: React.FC = () => (
  <XStack alignItems="center" justifyContent="space-between" width="100%" paddingHorizontal={10}>
    <AccountBadge />

    <XStack justifyContent="space-between" width="35%">
      <HeaderIcon />
      <HeaderIcon />
      <HeaderIcon />
    </XStack>
  </XStack>
);

