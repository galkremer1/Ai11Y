import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Popover,
} from "@patternfly/react-core";
import { useDemoTour } from "./DemoTourProvider";

export function ProductTour() {
  const { isActive, step, stepIndex, stepCount, next, back, skip, page } =
    useDemoTour();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive || !step) {
      setTarget(null);
      setRect(null);
      return;
    }

    if (step.page !== page) {
      setTarget(null);
      setRect(null);
      return;
    }

    if (!step.selector) {
      setTarget(null);
      setRect(null);
      return;
    }

    let attempts = 0;
    let timer = 0;
    const findTarget = (): void => {
      const el = document.querySelector(step.selector!) as HTMLElement | null;
      if (el) {
        setTarget(el);
        setRect(el.getBoundingClientRect());
        return;
      }
      attempts += 1;
      if (attempts < 25) {
        timer = window.setTimeout(findTarget, 50);
      }
    };
    timer = window.setTimeout(findTarget, 40);

    return () => window.clearTimeout(timer);
  }, [isActive, step, page, stepIndex]);

  useEffect(() => {
    if (!target) return;
    const update = (): void => setRect(target.getBoundingClientRect());
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [target]);

  if (!isActive || !step) return null;

  const footer = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--pf-t--global--spacer--sm)",
        flexWrap: "wrap",
      }}
    >
      <Button variant="link" onClick={skip}>
        Skip tour
      </Button>
      <span style={{ flex: 1 }} />
      <Button variant="secondary" onClick={back} isDisabled={stepIndex === 0}>
        Back
      </Button>
      <Button variant="primary" onClick={next}>
        {stepIndex === stepCount - 1 ? "Done" : "Next"}
      </Button>
    </div>
  );

  if (!step.selector) {
    return (
      <Modal
        isOpen
        variant="medium"
        onClose={skip}
        aria-labelledby="ai11y-tour-welcome-title"
        aria-describedby="ai11y-tour-welcome-body"
      >
        <ModalHeader
          title={step.title}
          labelId="ai11y-tour-welcome-title"
        />
        <ModalBody id="ai11y-tour-welcome-body">
          <p>{step.body}</p>
          <p
            style={{
              marginTop: "var(--pf-t--global--spacer--sm)",
              color: "var(--pf-t--global--text--color--subtle)",
            }}
          >
            Step {stepIndex + 1} of {stepCount}
          </p>
        </ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </Modal>
    );
  }

  return (
    <>
      {rect && (
        <div
          className="ai11y-tour-spotlight"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
          aria-hidden
        />
      )}
      {target && (
      <Popover
        isVisible
        hideOnOutsideClick={false}
        shouldClose={() => {
          skip();
        }}
        triggerRef={() => target}
        headerContent={step.title}
        bodyContent={
          <>
            <p>{step.body}</p>
            <p
              style={{
                marginTop: "var(--pf-t--global--spacer--sm)",
                color: "var(--pf-t--global--text--color--subtle)",
                fontSize: "var(--pf-t--global--font--size--sm)",
              }}
            >
              Step {stepIndex + 1} of {stepCount}
            </p>
          </>
        }
        footerContent={footer}
        position={step.position ?? "right"}
        appendTo={() => document.body}
        zIndex={10000}
        minWidth="18rem"
        maxWidth="22rem"
        withFocusTrap={false}
      />
      )}
    </>
  );
}
