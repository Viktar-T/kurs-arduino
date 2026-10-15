"use client";

/**
 * Copy-to-clipboard button for code blocks. Rendered by `Pre` next to the
 * `<pre>` it copies — not meant to be used directly in MDX.
 */
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyState = "idle" | "copied" | "error";

/**
 * Code text without highlighting markup (one `[data-line]` per line).
 * rehype-pretty-code renders a blank line as a single space, so
 * whitespace-only lines are copied as empty ones.
 */
function codeText(pre: HTMLPreElement) {
  const lines = pre.querySelectorAll("[data-line]");
  if (lines.length === 0) return pre.textContent ?? "";
  return Array.from(lines, (line) => {
    const text = line.textContent ?? "";
    return text.trim() === "" ? "" : text;
  }).join("\n");
}

async function writeClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for plain-http hosting (e.g. a classroom LAN server).
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy command was rejected");
}

const LABELS: Record<CopyState, string> = {
  idle: "Kopiuj",
  copied: "Skopiowano",
  error: "Nie udało się",
};

export function CopyButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function handleClick() {
    const pre = buttonRef.current?.parentElement?.querySelector("pre");
    if (!pre) return;
    try {
      await writeClipboard(codeText(pre));
      setState("copied");
    } catch {
      setState("error");
    }
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className="copy-code-btn"
      data-state={state}
      title="Kopiuj kod do schowka"
    >
      {state === "copied" ? (
        <Check aria-hidden className="h-3.5 w-3.5" />
      ) : (
        <Copy aria-hidden className="h-3.5 w-3.5" />
      )}
      <span aria-live="polite">{LABELS[state]}</span>
    </button>
  );
}
