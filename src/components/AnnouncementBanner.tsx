import {
  Alert,
  AlertDescription,
  Box,
  CloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ConfigurationDocument } from "../graphql/generated";
import { request } from "../utils/datocms/request";
import { maintanceIcon } from "./Icons";

const ANNOUNCEMENT_REFRESH_INTERVAL = 60 * 60 * 1000; // once an hour

export const AnnouncementBanner: React.FC = () => {
  const {
    isOpen: isVisible,
    onOpen,
    onClose,
  } = useDisclosure({ defaultIsOpen: true });

  const [message, setMessage] = useState<string | null | undefined>();

  useEffect(() => {
    const requestConfiguration = async () => {
      const result = await request(ConfigurationDocument);
      if (message !== result.configuration?.maintenanceMessage) {
        setMessage(result.configuration?.maintenanceMessage);
        onOpen();
      }
    };
    requestConfiguration();
    const intervalId = setInterval(() => {
      requestConfiguration();
    }, ANNOUNCEMENT_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [message, onOpen]);

  const MaintanceIcon = maintanceIcon;
  return isVisible && message ? (
    <Alert data-testid="announcement" color="black" bg="#FC7884">
      <MaintanceIcon />
      <Box w="100%" pl="8px">
        <AlertDescription>{message}</AlertDescription>
      </Box>
      <CloseButton onClick={onClose} />
    </Alert>
  ) : (
    <></>
  );
};
