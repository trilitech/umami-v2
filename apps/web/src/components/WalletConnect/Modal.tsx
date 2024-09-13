import { ModalContent, Modal as NextModal } from "@chakra-ui/react";
import { ModalStore } from "@umami/state";
import { useCallback, useMemo } from "react";
import { useSnapshot } from "valtio";

import LoadingModal from "./LoadingModal";
import SessionProposalModal from "./SessionProposalModal";
import SessionSignTezosModal from "./SessionSignTezosModal";
import SessionUnsuportedMethodModal from "./SessionUnsuportedMethodModal";


export default function Modal() {
  const { open, view } = useSnapshot(ModalStore.state);
  // handle the modal being closed by click outside
  const onClose = useCallback(() => {
    if (open) {
      ModalStore.close();
    }
  }, [open]);

  const componentView = useMemo(() => {
    console.log("Modal view: ", view);
    if (!view) {
      return null;
    }
    switch (view) {
      case "SessionProposalModal":
        return <SessionProposalModal />;
      case "SessionUnsuportedMethodModal":
        return <SessionUnsuportedMethodModal />;
      case "SessionSignTezosModal":
        return <SessionSignTezosModal />;
      case "LoadingModal":
        return <LoadingModal />;
      default:
        throw new Error("Unknown modal view");
    }
  }, [view]);

  return (
    <NextModal isOpen={open} onClose={onClose}>
      <ModalContent>{componentView}</ModalContent>
    </NextModal>
  );
}
