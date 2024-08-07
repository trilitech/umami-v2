import { useDynamicDrawerContext } from "@umami/components";

import { BaseBackButton } from "./BaseBackButton";

export const DrawerBackButton = () => {
  const { hasPrevious, goBack } = useDynamicDrawerContext();

  return hasPrevious ? <BaseBackButton onClick={goBack} /> : null;
};
