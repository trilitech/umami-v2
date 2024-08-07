import { useDynamicModalContext } from "@umami/components";

import { BaseCloseButton } from "./BaseCloseButton";

export const ModalCloseButton = () => {
  const { onClose } = useDynamicModalContext();

  return <BaseCloseButton onClick={onClose} />;
};
