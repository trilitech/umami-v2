import { renderHook, act } from "@testing-library/react";
import { useStepHistory } from "./useStepHistory";

type TestStep = "step1" | "step2" | "step3";

describe("useStepHistory", () => {
  describe("reset", () => {
    it("is an idempotent operation", () => {
      const { result: historyRef } = renderHook(() => useStepHistory<TestStep>("step1"));

      act(() => historyRef.current.goToStep("step2"));
      expect(historyRef.current.fullHistory.length).toEqual(2);

      act(() => historyRef.current.reset());
      expect(historyRef.current.atInitialStep).toEqual(true);
      expect(historyRef.current.currentStep).toEqual("step1");
      expect(historyRef.current.fullHistory.length).toEqual(1);

      act(() => historyRef.current.reset());
      expect(historyRef.current.atInitialStep).toEqual(true);
      expect(historyRef.current.currentStep).toEqual("step1");
      expect(historyRef.current.fullHistory.length).toEqual(1);
    });
  });

  describe("atInitialStep", () => {
    it("returns true only if the history is empty", () => {
      const { result: historyRef } = renderHook(() => useStepHistory<TestStep>("step1"));
      expect(historyRef.current.atInitialStep).toEqual(true);

      act(() => historyRef.current.goToStep("step2"));
      expect(historyRef.current.atInitialStep).toEqual(false);
    });
  });

  describe("goBack", () => {
    it("goes back one step at a time", () => {
      const { result: historyRef } = renderHook(() => useStepHistory<TestStep>("step1"));

      act(() => historyRef.current.goToStep("step2"));
      act(() => historyRef.current.goBack());
      expect(historyRef.current.atInitialStep).toEqual(true);
      expect(historyRef.current.currentStep).toEqual("step1");
    });

    it("cannot go back if at the initial step", () => {
      const { result: historyRef } = renderHook(() => useStepHistory<TestStep>("step1"));
      act(() => historyRef.current.goBack());

      expect(historyRef.current.atInitialStep).toEqual(true);
      expect(historyRef.current.currentStep).toEqual("step1");
    });
  });

  describe("goToStep", () => {
    it("allows go forward one step at a time", () => {
      const { result: historyRef } = renderHook(() => useStepHistory<TestStep>("step1"));

      act(() => historyRef.current.goToStep("step2"));
      expect(historyRef.current.fullHistory).toEqual(["step1", "step2"]);
    });

    it("allows for duplicate steps", () => {
      const { result: historyRef } = renderHook(() => useStepHistory<TestStep>("step1"));

      act(() => historyRef.current.goToStep("step2"));
      expect(historyRef.current.fullHistory).toEqual(["step1", "step2"]);

      act(() => historyRef.current.goToStep("step2"));
      expect(historyRef.current.fullHistory).toEqual(["step1", "step2", "step2"]);
    });
  });
});
