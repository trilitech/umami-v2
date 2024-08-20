import {
  Center,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  useColorMode,
} from "@chakra-ui/react";

import { track } from "@vercel/analytics";

import { LoginModalContent } from "./LoginModalContent";
import { sendLoginErrorResponse } from "./utils";
import { TezosSpinner } from "./assets/icons/TezosSpinner";

import { mode } from "@chakra-ui/theme-tools";

import { useLoginModalContext } from "./LoginModalContext";
import { useEmbedApp } from "./EmbedAppContext";

export const useLoginModal = () => {
  const { isOpen, onOpen, onClose, isLoading } = useLoginModalContext();
  const { getNetwork, getDAppOrigin } = useEmbedApp();

  const colorMode = useColorMode();

  const onModalCLose = () => {
    sendLoginErrorResponse("User closed the modal");
    onClose();
  };

  return {
    modalElement: (
      <Center>
        <Modal
          autoFocus={false}
          closeOnOverlayClick={false}
          isCentered
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalContent>
            <ModalCloseButton onClick={onModalCLose} />
            <LoginModalContent />
            {isLoading && (
              <Flex
                position="absolute"
                top="0"
                right="0"
                bottom="0"
                left="0"
                alignItems="center"
                justifyContent="center"
                borderRadius="30px"
                backgroundColor={mode(
                  "rgba(255, 255, 255, 0.85)", // light
                  "rgba(16, 18, 27, 0.85)" // dark
                )(colorMode)}
              >
                <TezosSpinner />
              </Flex>
            )}
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen: () => {
      track("login_modal_opened", { network: getNetwork(), dAppOrigin: getDAppOrigin() });
      onOpen();
    },
  };
};
