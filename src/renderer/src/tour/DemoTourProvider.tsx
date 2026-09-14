import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Page } from "../components/layout/Sidebar";
import { TOUR_STEPS, type TourStep } from "./tour-steps";

interface DemoTourContextValue {
  page: Page;
  setPage: (page: Page) => void;
  isActive: boolean;
  stepIndex: number;
  step: TourStep | null;
  stepCount: number;
  tourSession: number;
  start: () => void;
  next: () => void;
  back: () => void;
  skip: () => void;
}

const DemoTourContext = createContext<DemoTourContextValue | null>(null);

export function DemoTourProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>("ide");
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourSession, setTourSession] = useState(0);

  const step = isActive ? (TOUR_STEPS[stepIndex] ?? null) : null;

  const start = useCallback(() => {
    setPage("setup");
    setStepIndex(0);
    setIsActive(true);
    setTourSession((current) => current + 1);
  }, []);

  const skip = useCallback(() => {
    setIsActive(false);
  }, []);

  const next = useCallback(() => {
    setStepIndex((current) => {
      const upcoming = current + 1;
      if (upcoming >= TOUR_STEPS.length) {
        setIsActive(false);
        return current;
      }
      const nextStep = TOUR_STEPS[upcoming];
      if (nextStep) setPage(nextStep.page);
      return upcoming;
    });
  }, []);

  const back = useCallback(() => {
    setStepIndex((current) => {
      const previous = Math.max(0, current - 1);
      const prevStep = TOUR_STEPS[previous];
      if (prevStep) setPage(prevStep.page);
      return previous;
    });
  }, []);

  const value = useMemo(
    () => ({
      page,
      setPage,
      isActive,
      stepIndex,
      step,
      stepCount: TOUR_STEPS.length,
      tourSession,
      start,
      next,
      back,
      skip,
    }),
    [page, isActive, stepIndex, step, tourSession, start, next, back, skip],
  );

  return (
    <DemoTourContext.Provider value={value}>{children}</DemoTourContext.Provider>
  );
}

export function useDemoTour(): DemoTourContextValue {
  const ctx = useContext(DemoTourContext);
  if (!ctx) {
    throw new Error("useDemoTour must be used within DemoTourProvider");
  }
  return ctx;
}
