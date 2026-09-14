import type { DetailedHTMLProps, HTMLAttributes } from "react";

type WebviewHTMLAttributes = HTMLAttributes<HTMLElement> & {
  src?: string;
  partition?: string;
  allowpopups?: boolean | string;
};

export interface ElectronWebviewElement extends HTMLElement {
  src: string;
  getURL(): string;
  goBack(): void;
  goForward(): void;
  reload(): void;
  stop(): void;
  canGoBack(): boolean;
  canGoForward(): boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      webview: DetailedHTMLProps<WebviewHTMLAttributes, ElectronWebviewElement>;
    }
  }
}

export {};
