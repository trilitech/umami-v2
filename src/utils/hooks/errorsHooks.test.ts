import { renderHook } from "@testing-library/react";
import { errorContext1, errorContext2 } from "../../mocks/errorContext";
import { getWrapper } from "../../mocks/store";
import errorsSlice from "../redux/slices/errorsSlice";
import store from "../redux/store";
import { useSortedErrors } from "./errorsHooks";

describe("useSortedErrors", () => {
  it("useSortedErrors sorts errors by timestamp", () => {
    store.dispatch(errorsSlice.actions.add(errorContext1));
    store.dispatch(errorsSlice.actions.add(errorContext2));

    const { result } = renderHook(() => useSortedErrors(), {
      wrapper: getWrapper(store),
    });

    expect(result.current).toEqual([errorContext2, errorContext1]);
  });
});
