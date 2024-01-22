import { announcementSlice } from "./announcementSlice";
import { store } from "../store";

describe("announcementSlice", () => {
  it("is empty by default", () => {
    expect(store.getState().announcement).toEqual({
      html: "",
      seen: true,
    });
  });

  it("updates the current announcement", () => {
    store.dispatch(announcementSlice.actions.setCurrent("test"));

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: false,
    });
  });

  it("marks the current announcement as seen", () => {
    store.dispatch(announcementSlice.actions.setCurrent("test"));
    store.dispatch(announcementSlice.actions.setSeen());

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: true,
    });
  });

  it("doesn't mark the message as seen if it hasn't changed", () => {
    store.dispatch(announcementSlice.actions.setCurrent("test"));
    store.dispatch(announcementSlice.actions.setCurrent("test"));

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: false,
    });
  });

  it("doesn't mark the message as not seen if it hasn't changed", () => {
    store.dispatch(announcementSlice.actions.setCurrent("test"));

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: false,
    });

    store.dispatch(announcementSlice.actions.setSeen());

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: true,
    });

    store.dispatch(announcementSlice.actions.setCurrent("test"));

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: true,
    });
  });
});
