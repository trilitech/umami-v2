import { announcementActions } from "./announcement";
import { type UmamiStore, makeStore } from "../store";

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("announcementSlice", () => {
  it("is empty by default", () => {
    expect(store.getState().announcement).toEqual({
      html: "",
      seen: true,
    });
  });

  it("updates the current announcement", () => {
    store.dispatch(announcementActions.setCurrent("test"));

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: false,
    });
  });

  it("marks the current announcement as seen", () => {
    store.dispatch(announcementActions.setCurrent("test"));
    store.dispatch(announcementActions.setSeen());

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: true,
    });
  });

  it("doesn't mark the message as seen if it hasn't changed", () => {
    store.dispatch(announcementActions.setCurrent("test"));
    store.dispatch(announcementActions.setCurrent("test"));

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: false,
    });
  });

  it("doesn't mark the message as not seen if it hasn't changed", () => {
    store.dispatch(announcementActions.setCurrent("test"));

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: false,
    });

    store.dispatch(announcementActions.setSeen());

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: true,
    });

    store.dispatch(announcementActions.setCurrent("test"));

    expect(store.getState().announcement).toEqual({
      html: "test",
      seen: true,
    });
  });
});
