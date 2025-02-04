import { X } from "@tamagui/lucide-icons";
import { Button, styled } from "tamagui";

import { useModal } from "../../providers/ModalProvider";

export const ModalCloseButton = () => {
  const { hideModal } = useModal();

  return <CloseButton icon={<X />} onPress={hideModal} />;
};

const CloseButton = styled(Button, {
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: 1000,
  borderRadius: 100,
  width: "auto",
  height: "auto",
  padding: 10,
});
