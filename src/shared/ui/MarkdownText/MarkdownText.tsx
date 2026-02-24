import type { ReactNode } from "react";

interface MarkdownTextProps {
  text: string;
  className?: string;
}

const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function renderParts(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = MARKDOWN_LINK_REGEX.exec(text)) !== null) {
    const [raw, label, href] = match;
    const start = match.index;

    if (start > last) {
      parts.push(...renderPlainText(text.slice(last, start), `plain-${last}`));
    }

    parts.push(
      <a
        key={`md-link-${start}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-cyan-300 underline decoration-cyan-600/50 underline-offset-2 hover:text-cyan-200"
      >
        {label}
      </a>,
    );

    last = start + raw.length;
  }

  if (last < text.length) {
    parts.push(...renderPlainText(text.slice(last), `tail-${last}`));
  }

  return parts;
}

function renderPlainText(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(text)) !== null) {
    const [url] = match;
    const start = match.index;

    if (start > last) {
      nodes.push(text.slice(last, start));
    }

    nodes.push(
      <a
        key={`${keyPrefix}-${start}`}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-cyan-300 underline decoration-cyan-600/50 underline-offset-2 hover:text-cyan-200"
      >
        {url}
      </a>,
    );

    last = start + url.length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes;
}

export function MarkdownText({ text, className }: MarkdownTextProps) {
  return <p className={className}>{renderParts(text)}</p>;
}
