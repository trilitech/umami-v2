import {
  Alert,
  AlertDescription,
  Box,
  CloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ConfigurationDocument } from "./graphql/generated";
import { request } from "./utils/datocms/request";
import { maintanceIcon } from "./components/Icons";

export const AnnouncementBanner: React.FC = () => {
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true });

  const [message, setMessage] = useState<string | null | undefined>(null);

  const requestConfiguraiton = async () => {
    const result = await request(ConfigurationDocument);
    setMessage(result.configuration?.maintenanceMessage);
  };

  useEffect(() => {
    requestConfiguraiton();
  });

  const MaintanceIcon = maintanceIcon;
  return isVisible && message ? (
    <Alert color="black" bg="#FC7884">
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
