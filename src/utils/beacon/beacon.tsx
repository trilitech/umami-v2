import { WalletClient } from "@airgap/beacon-wallet";
import { Modal, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export const client = new WalletClient({ name: "My Wallet" });

type BeaconNotificationMessage = any; // PermissionRequest, TranferRequest, DelegationRequest etc...

const renderBeaconNotification = (n: BeaconNotificationMessage) => {
  // Given a beacon message display the correct window:
  // -Permission request
  // -Transfer request
  // Those are the only 2 that are implemented in V1 mobile. Probably others are required.

  return null;
};

export const useBeaconModalNotification = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const beaconMessage = useRef<BeaconNotificationMessage>();

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        {beaconMessage.current &&
          renderBeaconNotification(beaconMessage.current)}
      </Modal>
    ),

    onOpen: (beaconMessage: BeaconNotificationMessage) => {
      beaconMessage.current = beaconMessage;
      onOpen();
      beaconMessage.current = null;
    },
  };
};

export const useBeaconInit = () => {
  const { modalElement: beaconModal, onOpen } = useBeaconModalNotification();

  // Ref is needed because otherwise onOpen needs to be added in useEffect dependencies
  // and that might trigger the effect again if onOpen reference isn't stable
  const handleBeaconMessage = useRef(onOpen);

  useEffect(() => {
    // This code runs once, even if the hosting component rerenders
    // because the dependency array is empty
    client
      .init()
      .then(() => {
        client.connect(handleBeaconMessage.current);
      })
      .catch(console.error);
  }, []);

  return beaconModal;
};

export const useBeaconCleanup = () => {
  // Disconnect everything when user logs out
};
