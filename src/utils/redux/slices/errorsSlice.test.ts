import store from "../store";
import errorsSlice from "./errorsSlice";
const { add } = errorsSlice.actions;

describe("Errors reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().errors).toEqual([]);
  });

  test("errors are added to the store", () => {
    const errorInfo1 = { timestamp: "timestamp", description: `error1`, stacktrace: "stacktrace" };
    const errorInfo2 = { timestamp: "timestamp", description: `error2`, stacktrace: "stacktrace" };
    store.dispatch(add(errorInfo1));
    store.dispatch(add(errorInfo2));

    expect(store.getState().errors).toEqual([errorInfo1, errorInfo2]);
  });

  test("errors rotate after 100", () => {
    for (let i = 0; i <= 100; i++) {
      store.dispatch(
        add({ timestamp: "timestamp", description: `error ${i}`, stacktrace: "stacktrace" })
      );
    }

    const errors = store.getState().errors;
    expect(errors[0].description).toEqual("error 1");
    expect(errors[errors.length - 1].description).toEqual("error 100");
  });
});
