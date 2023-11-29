import { errorContext1, errorContext2 } from "../../../mocks/errorContext";
import { store } from "../store";
import { errorsSlice } from "./errorsSlice";
const { add } = errorsSlice.actions;

describe("Errors reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().errors).toEqual([]);
  });

  test("errors are added to the store", () => {
    store.dispatch(add(errorContext1));
    store.dispatch(add(errorContext2));

    expect(store.getState().errors).toEqual([errorContext1, errorContext2]);
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
