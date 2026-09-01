import type { AxeViolation } from "../schemas/axe.schemas";

export const mockAxeViolations: AxeViolation[] = [
  {
    id: "color-contrast",
    impact: "serious",
    description:
      "Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
    helpUrl: "https://dequeuniversity.com/rules/axe/4.9/color-contrast",
    nodes: [
      {
        html: '<p class="subtitle" style="color: #999; background: #fff">Welcome to our site</p>',
        target: [".subtitle"],
        failureSummary:
          "Fix any of the following: Element has insufficient color contrast of 2.85 (foreground color: #999999, background color: #ffffff, font size: 12pt, font weight: normal). Expected contrast ratio of 4.5:1",
      },
    ],
  },
  {
    id: "image-alt",
    impact: "critical",
    description:
      "Ensures <img> elements have alternate text or a role of none or presentation",
    helpUrl: "https://dequeuniversity.com/rules/axe/4.9/image-alt",
    nodes: [
      {
        html: '<img src="/hero-banner.jpg">',
        target: ['img[src="/hero-banner.jpg"]'],
        failureSummary:
          "Fix any of the following: Element does not have an alt attribute",
      },
      {
        html: '<img src="/team-photo.png">',
        target: ['img[src="/team-photo.png"]'],
        failureSummary:
          "Fix any of the following: Element does not have an alt attribute",
      },
    ],
  },
  {
    id: "button-name",
    impact: "critical",
    description: "Ensures buttons have discernible text",
    helpUrl: "https://dequeuniversity.com/rules/axe/4.9/button-name",
    nodes: [
      {
        html: '<button class="icon-btn"><svg>...</svg></button>',
        target: [".icon-btn"],
        failureSummary:
          "Fix any of the following: Element does not have inner text that is visible to screen readers",
      },
    ],
  },
  {
    id: "html-has-lang",
    impact: "serious",
    description: "Ensures every HTML document has a lang attribute",
    helpUrl: "https://dequeuniversity.com/rules/axe/4.9/html-has-lang",
    nodes: [
      {
        html: "<html>",
        target: ["html"],
        failureSummary:
          "Fix any of the following: The <html> element does not have a lang attribute",
      },
    ],
  },
  {
    id: "link-name",
    impact: "serious",
    description: "Ensures links have discernible text",
    helpUrl: "https://dequeuniversity.com/rules/axe/4.9/link-name",
    nodes: [
      {
        html: '<a href="/profile"><img src="/avatar.png"></a>',
        target: ['a[href="/profile"]'],
        failureSummary:
          "Fix all of the following: Element is in tab order and does not have accessible text",
      },
    ],
  },
];
