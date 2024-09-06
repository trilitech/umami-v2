import { useDynamicModalContext } from "@umami/components";

import { BaseBackButton } from "./BaseBackButton";

export const ModalBackButton = () => {
  const { hasPrevious, goBack } = useDynamicModalContext();

  return hasPrevious ? <BaseBackButton onClick={() => goBack()} /> : null;
};
