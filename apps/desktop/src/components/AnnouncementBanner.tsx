import { Alert, AlertDescription, Center, CloseButton, Flex } from "@chakra-ui/react";
import { announcementActions, useAppDispatch, useAppSelector } from "@umami/state";
import { useEffect } from "react";

import { MaintenanceIcon } from "../assets/icons";
import colors from "../style/colors";

const ANNOUNCEMENT_REFRESH_INTERVAL = 60 * 60 * 1000; // once an hour
const ANNOUNCEMENT_FILE_URL = "https://storage.googleapis.com/umami-artifacts/announcement.html";

/**
 * Announcement banner that is displayed on top of the page when
 * we fetch a new notification from the server
 * Once the user closes the notification, it won't show up again until
 * we post a new one
 */
export const AnnouncementBanner = () => {
  const { html: announcementHTML, seen } = useAppSelector(s => s.announcement);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const updateCurrentAnnouncement = () => {
      fetch(ANNOUNCEMENT_FILE_URL)
        .then(response => response.text())
        .then(data => dispatch(announcementActions.setCurrent(data)))
        .catch(_ => {
          // if we can't fetch the announcement (whether it's 404 or network error)
          // we just don't do anything
        });
    };

    updateCurrentAnnouncement();

    const interval = setInterval(updateCurrentAnnouncement, ANNOUNCEMENT_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (seen || !announcementHTML) {
    return null;
  }

  return (
    <Alert
      className="announcement-banner"
      color="black"
      background={colors.orangeL}
      data-testid="announcement"
      paddingX="30px"
    >
      <Flex justifyContent="space-between" width="100%">
        <Center>
          <MaintenanceIcon marginRight="4px" />
          <AlertDescription
            fontSize="14px"
            dangerouslySetInnerHTML={{ __html: announcementHTML }}
          />
        </Center>
        <CloseButton data-testid="close" onClick={() => dispatch(announcementActions.setSeen())} />
      </Flex>
    </Alert>
  );
};
