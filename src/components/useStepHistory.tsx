import { useState } from "react";

/*
  Simple history tracking hook.
  Requires an initial state (e.g. cannot go back to nowhere)
  Allows only to go to a new page, go back, or reset the history.
*/
export const useStepHistory = <S,>(initialStep: S) => {
  const [step, setStep] = useState<S>(initialStep);
  const [history, setHistory] = useState<S[]>([step]);
  const atInitialStep = history.length === 1;

  return {
    reset: () => {
      setStep(initialStep);
      setHistory([initialStep]);
    },
    goToStep: (step: S) => {
      setStep(step);
      setHistory([...history, step]);
    },
    currentStep: step,
    goBack: () => {
      if (atInitialStep) {
        return;
      }
      history.pop();
      const previous = history[history.length - 1];
      setHistory(history);
      setStep(previous);
    },
    atInitialStep: atInitialStep,
    fullHistory: history,
  };
};
