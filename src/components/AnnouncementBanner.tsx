import { Alert, AlertDescription, Box, CloseButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { maintanceIcon } from "./Icons";
import { ConfigurationDocument } from "../graphql/generated";
import { request } from "../utils/datocms/request";

const ANNOUNCEMENT_REFRESH_INTERVAL = 60 * 60 * 1000; // once an hour

export const AnnouncementBanner: React.FC = () => {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState<string | null | undefined>();

  useEffect(() => {
    const requestConfiguration = async () => {
      const result = await request(ConfigurationDocument);
      if (message !== result.configuration?.maintenanceMessage) {
        setMessage(result.configuration?.maintenanceMessage);
        // TODO: make the announcements not appear again after closing and uncomment this
        // setOpen(true);
      }
    };
    requestConfiguration();
    const intervalId = setInterval(() => {
      requestConfiguration();
    }, ANNOUNCEMENT_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [message, open]);

  const MaintanceIcon = maintanceIcon;
  return open && message ? (
    <Alert color="black" background="#FC7884" data-testid="announcement">
      <MaintanceIcon />
      <Box width="100%" paddingLeft="8px">
        <AlertDescription>{message}</AlertDescription>
      </Box>
      <CloseButton onClick={() => setOpen(false)} />
    </Alert>
  ) : null;
};
