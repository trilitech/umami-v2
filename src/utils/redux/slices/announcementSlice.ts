import { createSlice } from "@reduxjs/toolkit";

type State = {
  html: string;
  seen: boolean;
};

export const initialState: State = { html: "", seen: true };

/**
 * We might want to push a notification to our users
 * To do that we need to populate the announcement.html file on GCS
 *
 * The app checks the file once in a while to see if it has changed
 * if it has, it will show the notification to the user
 *
 * Once the user closes the notification, it will not be shown again
 * until we fetch another one
 */
export const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    reset: () => initialState,
    setCurrent: (state, { payload }: { payload: string }) => {
      // update the seen state only if the message has changed
      if (payload !== state.html) {
        state.seen = false;
      }
      state.html = payload;
    },
    setSeen: state => {
      state.seen = true;
    },
  },
});
