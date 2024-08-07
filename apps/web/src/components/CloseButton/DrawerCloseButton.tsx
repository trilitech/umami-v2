import { useDynamicDrawerContext } from "@umami/components";

import { BaseCloseButton } from "./BaseCloseButton";

export const DrawerCloseButton = () => {
  const { onClose } = useDynamicDrawerContext();

  return <BaseCloseButton onClick={onClose} />;
};
