import type { EslintError } from "@shared/schemas/eslint.schemas";
import type { FileTreeNode } from "@shared/schemas/filesystem.schemas";

export const TOUR_DEMO_DIRECTORY = "Tour sample";
export const TOUR_DEMO_ROOT = "/tour-sample";

export const TOUR_DEMO_LOGIN = `${TOUR_DEMO_ROOT}/src/components/LoginForm.tsx`;
export const TOUR_DEMO_NAV = `${TOUR_DEMO_ROOT}/src/components/NavBar.tsx`;
export const TOUR_DEMO_IMAGE = `${TOUR_DEMO_ROOT}/src/components/ImageCard.tsx`;

export const TOUR_DEMO_URLS = {
  example: "https://example.com",
  waiBefore: "https://www.w3.org/WAI/demos/bad/before/home.html",
} as const;

const LOGIN_FORM = `export function LoginForm() {
  function handleSubmit() {
    // submit credentials
  }

  return (
    <form>
      <img src="/logo.png" />
      <div>
        <label>Email</label>
        <input type="email" autoFocus />
      </div>
      <div>
        <label>Password</label>
        <input type="password" />
      </div>
      <div onClick={() => handleSubmit()}>
        <button className="icon-btn">
          <svg />
        </button>
      </div>
    </form>
  );
}
`;

const NAV_BAR = `export function NavBar() {
  return (
    <nav>
      <a onClick={() => undefined}>Home</a>
      <a href="/about">About</a>
    </nav>
  );
}
`;

const IMAGE_CARD = `export function ImageCard() {
  return (
    <article>
      <img src="/hero.jpg" />
      <p>Featured</p>
    </article>
  );
}
`;

export const TOUR_DEMO_FILES: Record<string, string> = {
  [TOUR_DEMO_LOGIN]: LOGIN_FORM,
  [TOUR_DEMO_NAV]: NAV_BAR,
  [TOUR_DEMO_IMAGE]: IMAGE_CARD,
};

export const TOUR_DEMO_TREE: FileTreeNode = {
  name: "tour-sample",
  path: TOUR_DEMO_ROOT,
  type: "directory",
  children: [
    {
      name: "src",
      path: `${TOUR_DEMO_ROOT}/src`,
      type: "directory",
      children: [
        {
          name: "components",
          path: `${TOUR_DEMO_ROOT}/src/components`,
          type: "directory",
          children: [
            {
              name: "LoginForm.tsx",
              path: TOUR_DEMO_LOGIN,
              type: "file",
            },
            {
              name: "NavBar.tsx",
              path: TOUR_DEMO_NAV,
              type: "file",
            },
            {
              name: "ImageCard.tsx",
              path: TOUR_DEMO_IMAGE,
              type: "file",
            },
          ],
        },
      ],
    },
  ],
};

export const TOUR_DEMO_ESLINT: EslintError[] = [
  {
    file: TOUR_DEMO_LOGIN,
    line: 8,
    column: 7,
    ruleId: "jsx-a11y/alt-text",
    severity: "error",
    message:
      "img elements must have an alt prop, either with meaningful text, or an empty string for decorative images.",
  },
  {
    file: TOUR_DEMO_LOGIN,
    line: 10,
    column: 9,
    ruleId: "jsx-a11y/label-has-associated-control",
    severity: "error",
    message: "A form label must be associated with a control.",
  },
  {
    file: TOUR_DEMO_LOGIN,
    line: 11,
    column: 9,
    ruleId: "jsx-a11y/no-autofocus",
    severity: "warning",
    message:
      "The autoFocus prop should not be used, as it can reduce usability and accessibility for users.",
  },
  {
    file: TOUR_DEMO_NAV,
    line: 4,
    column: 7,
    ruleId: "jsx-a11y/anchor-is-valid",
    severity: "error",
    message: "The href attribute requires a valid value to be accessible.",
  },
  {
    file: TOUR_DEMO_IMAGE,
    line: 4,
    column: 7,
    ruleId: "jsx-a11y/alt-text",
    severity: "error",
    message:
      "img elements must have an alt prop, either with meaningful text, or an empty string for decorative images.",
  },
];

export function isTourDemoPath(filePath: string): boolean {
  return filePath.startsWith(`${TOUR_DEMO_ROOT}/`);
}

export function isTourDemoDirectory(directory: string | null): boolean {
  return directory === TOUR_DEMO_DIRECTORY;
}
