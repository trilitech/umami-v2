import { ArrowLeft } from "@tamagui/lucide-icons";
import { Button, styled } from "tamagui";

import { useModal } from "../../providers/ModalProvider";

type ModalBackButtonProps = {
  goBack?: () => void;
};

export const ModalBackButton = ({ goBack }: ModalBackButtonProps) => {
  const { hideModal } = useModal();

  return <BackButton icon={<ArrowLeft />} onPress={goBack ?? hideModal} />;
};

const BackButton = styled(Button, {
  position: "absolute",
  top: 12,
  left: 12,
  zIndex: 1000,
  borderRadius: 100,
  width: "auto",
  height: "auto",
  padding: 10,
});
