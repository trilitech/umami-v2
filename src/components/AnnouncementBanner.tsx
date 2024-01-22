import { Alert, AlertDescription, Box, CloseButton } from "@chakra-ui/react";
import { useState } from "react";

import { MaintenanceIcon } from "./Icons";

const _ANNOUNCEMENT_REFRESH_INTERVAL = 60 * 60 * 1000; // once an hour

// TODO: finish up this component
export const AnnouncementBanner: React.FC = () => {
  const [open, setOpen] = useState(false);

  const [message, _setMessage] = useState<string | null | undefined>();

  return open && message ? (
    <Alert color="black" background="#FC7884" data-testid="announcement">
      <MaintenanceIcon />
      <Box width="100%" paddingLeft="8px">
        <AlertDescription>{message}</AlertDescription>
      </Box>
      <CloseButton onClick={() => setOpen(false)} />
    </Alert>
  ) : null;
};
