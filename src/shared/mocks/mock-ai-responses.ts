import type { AnalyzeCodeResponse } from "../schemas/ai-analysis.schemas";
import type { AnalyzeHtmlResponse } from "../schemas/ai-analysis.schemas";

export const mockAnalyzeCodeResponse: AnalyzeCodeResponse = {
  fixes: [
    {
      file: "src/components/LoginForm.tsx",
      line: 7,
      original:
        '<label>Email</label>\n        <input type="email" autoFocus />',
      fixed:
        '<label htmlFor="email-input">Email</label>\n        <input id="email-input" type="email" />',
      explanation:
        "Associate the label with the input using htmlFor/id and remove autoFocus which can disorient screen reader users.",
    },
    {
      file: "src/components/LoginForm.tsx",
      line: 14,
      original:
        '<div onClick={() => handleSubmit()}>\n        <button class="icon-btn">',
      fixed:
        '<div>\n        <button type="submit" aria-label="Submit login form" onClick={() => handleSubmit()}>',
      explanation:
        "Move the click handler to the button element and add an aria-label since the button only contains an icon.",
    },
    {
      file: "src/components/LoginForm.tsx",
      line: 21,
      original: '<img src="/logo.png" />',
      fixed: '<img src="/logo.png" alt="Company logo" />',
      explanation: "Add descriptive alt text for the image.",
    },
  ],
  summary:
    "Found 3 accessibility issues: missing label associations, click handler on non-interactive element, and missing alt text.",
};

export const mockAnalyzeHtmlResponse: AnalyzeHtmlResponse = {
  fixes: [
    {
      selector: 'img[src="/hero-banner.jpg"]',
      original: '<img src="/hero-banner.jpg">',
      fixed:
        '<img src="/hero-banner.jpg" alt="Hero banner showcasing our product">',
      explanation: "Add descriptive alt text for the hero banner image.",
    },
    {
      selector: ".icon-btn",
      original: '<button class="icon-btn"><svg>...</svg></button>',
      fixed:
        '<button class="icon-btn" aria-label="Menu"><svg aria-hidden="true">...</svg></button>',
      explanation:
        "Add aria-label to the icon button and mark the decorative SVG as aria-hidden.",
    },
    {
      selector: "html",
      original: "<html>",
      fixed: '<html lang="en">',
      explanation:
        "Add a lang attribute to the html element for screen readers.",
    },
  ],
  summary:
    "Found 3 accessibility issues: missing alt text, unlabeled icon button, and missing lang attribute on html element.",
};
