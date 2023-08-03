import store from "../store";
import errorsSlice from "./errorsSlice";
const { add } = errorsSlice.actions;

describe("Errors reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().errors).toEqual([]);
  });

  test("adds new error", () => {
    for (let i = 0; i <= 100; i++) {
      store.dispatch(
        add({ timestamp: "timestamp", description: `error ${i}`, stacktrace: "stacktrace" })
      );
    }

    const errors = store.getState().errors;
    expect(errors.length).toEqual(100);
    expect(errors[0].description).toEqual("error 1");
    expect(errors[errors.length - 1].description).toEqual("error 100");
  });
});
