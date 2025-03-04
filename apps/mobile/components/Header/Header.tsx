import { XStack } from "tamagui";

import { AccountBadge } from "../AccountBadge";
import { HeaderIcon } from "../HeaderIcon";

export const Header = () => (
  <XStack alignItems="center" justifyContent="space-between" width="100%" paddingHorizontal={10}>
    <AccountBadge />

    <XStack justifyContent="space-between" width="35%">
      <HeaderIcon />
      <HeaderIcon />
      <HeaderIcon />
    </XStack>
  </XStack>
);
