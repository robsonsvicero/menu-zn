"use client";

import { type ClipboardEvent, useMemo, useRef, useState } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";

type BlogContentEditorProps = {
  name?: string;
  defaultValue?: string;
};

const allowedTags = new Set([
  "A",
  "B",
  "BLOCKQUOTE",
  "BR",
  "DIV",
  "EM",
  "H2",
  "H3",
  "I",
  "LI",
  "OL",
  "P",
  "STRONG",
  "U",
  "UL",
]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>");
}

function markdownToHtml(value: string) {
  const blocks = value
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return "";
  }

  return blocks
    .map((block) => {
      if (block.startsWith("### ")) {
        return `<h3>${formatInlineMarkdown(block.slice(4))}</h3>`;
      }

      if (block.startsWith("## ")) {
        return `<h2>${formatInlineMarkdown(block.slice(3))}</h2>`;
      }

      if (block.startsWith("> ")) {
        return `<blockquote>${formatInlineMarkdown(block.replace(/^>\s?/gm, ""))}</blockquote>`;
      }

      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        return `<ul>${lines
          .map((line) => `<li>${formatInlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>`)
          .join("")}</ul>`;
      }

      if (lines.every((line) => /^\d+\.\s+/.test(line))) {
        return `<ol>${lines
          .map((line) => `<li>${formatInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`)
          .join("")}</ol>`;
      }

      return `<p>${lines.map(formatInlineMarkdown).join("<br>")}</p>`;
    })
    .join("");
}

function sanitizeHtml(value: string) {
  if (typeof window === "undefined" || !value.trim()) {
    return value;
  }

  const template = document.createElement("template");
  template.innerHTML = value;

  template.content.querySelectorAll("*").forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const isAllowedLink = element.tagName === "A" && ["href", "target", "rel"].includes(name);

      if (!isAllowedLink) {
        element.removeAttribute(attribute.name);
      }
    });

    if (element.tagName === "A") {
      const href = element.getAttribute("href") ?? "";
      const isSafeHref = /^(https?:\/\/|mailto:)/i.test(href);

      if (!isSafeHref) {
        element.removeAttribute("href");
      }

      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noreferrer");
    }
  });

  return template.innerHTML;
}

function unwrapElement(element: Element) {
  element.replaceWith(...Array.from(element.childNodes));
}

function wrapRootListItems(template: HTMLTemplateElement) {
  const nodes = Array.from(template.content.childNodes);
  const wrappedNodes: ChildNode[] = [];
  let list: HTMLUListElement | null = null;

  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === "LI") {
      if (!list) {
        list = document.createElement("ul");
        wrappedNodes.push(list);
      }

      list.appendChild(node);
      return;
    }

    list = null;
    wrappedNodes.push(node);
  });

  template.content.replaceChildren(...wrappedNodes);
}

function cleanWordHtml(value: string) {
  if (typeof window === "undefined" || !value.trim()) {
    return value;
  }

  const template = document.createElement("template");
  template.innerHTML = value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[\s\S]*?>/gi, "");

  template.content.querySelectorAll("style, script, meta, link, xml").forEach((element) => {
    element.remove();
  });

  template.content.querySelectorAll("*").forEach((element) => {
    const tagName = element.tagName;

    if (tagName === "H1") {
      const heading = document.createElement("h2");
      heading.replaceChildren(...Array.from(element.childNodes));
      element.replaceWith(heading);
      return;
    }

    if (["H4", "H5", "H6"].includes(tagName)) {
      const heading = document.createElement("h3");
      heading.replaceChildren(...Array.from(element.childNodes));
      element.replaceWith(heading);
      return;
    }

    if (tagName === "SPAN" || tagName === "FONT" || tagName === "O:P") {
      unwrapElement(element);
      return;
    }

    const className = element.getAttribute("class") ?? "";
    const style = element.getAttribute("style") ?? "";
    const looksLikeWordList = /\bMsoListParagraph\b/i.test(className) || /mso-list:/i.test(style);

    if (looksLikeWordList && tagName === "P") {
      const item = document.createElement("li");
      item.innerHTML = element.innerHTML.replace(/^(\s|&nbsp;|[\u00b7\u2022\-o]|\d+[.)])+/, "");
      element.replaceWith(item);
    }
  });

  const nodes = Array.from(template.content.childNodes);
  const wrappedNodes = nodes.map((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      const paragraph = document.createElement("p");
      paragraph.textContent = node.textContent;
      return paragraph;
    }

    return node;
  });

  template.content.replaceChildren(...wrappedNodes);
  wrapRootListItems(template);
  return sanitizeHtml(template.innerHTML);
}

function prepareInitialHtml(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  return sanitizeHtml(looksLikeHtml ? trimmed : markdownToHtml(trimmed));
}

function insertHtmlAtSelection(editor: HTMLElement, value: string) {
  editor.focus();

  const selection = window.getSelection();
  const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

  if (!selection || !range || !editor.contains(range.commonAncestorContainer)) {
    editor.insertAdjacentHTML("beforeend", value);
    return;
  }

  range.deleteContents();

  const template = document.createElement("template");
  template.innerHTML = value;
  const fragment = template.content;
  const lastNode = fragment.lastChild;

  range.insertNode(fragment);

  if (lastNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

export function BlogContentEditor({ name = "content_md", defaultValue = "" }: BlogContentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialHtml = useMemo(() => prepareInitialHtml(defaultValue), [defaultValue]);
  const [html, setHtml] = useState(initialHtml);

  function syncEditor() {
    setHtml(sanitizeHtml(editorRef.current?.innerHTML ?? ""));
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    const clipboardHtml = event.clipboardData.getData("text/html");
    const clipboardText = event.clipboardData.getData("text/plain");
    const pastedHtml = clipboardHtml ? cleanWordHtml(clipboardHtml) : markdownToHtml(clipboardText);

    if (!pastedHtml.trim()) {
      return;
    }

    event.preventDefault();
    insertHtmlAtSelection(editor, pastedHtml);
    setHtml(sanitizeHtml(editor.innerHTML));
  }

  function runCommand(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncEditor();
  }

  function setBlock(tagName: "p" | "h2" | "h3" | "blockquote") {
    runCommand("formatBlock", tagName);
  }

  function addLink() {
    const url = window.prompt("Cole a URL do link");

    if (!url) {
      return;
    }

    const normalizedUrl = /^(https?:\/\/|mailto:)/i.test(url) ? url : `https://${url}`;
    runCommand("createLink", normalizedUrl);
  }

  const buttonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline/20 bg-white text-on-surface/75 transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25";

  return (
    <div className="rounded-2xl border border-outline/20 bg-[#faf8f5] p-2">
      <input type="hidden" name={name} value={html} />
      <div className="flex flex-wrap items-center gap-1.5 border-b border-outline/10 px-1 pb-2">
        <button type="button" title="Parágrafo" className={buttonClass} onClick={() => setBlock("p")}>
          <Pilcrow size={16} aria-hidden="true" />
        </button>
        <button type="button" title="Título médio" className={buttonClass} onClick={() => setBlock("h2")}>
          <Heading2 size={16} aria-hidden="true" />
        </button>
        <button type="button" title="Título pequeno" className={buttonClass} onClick={() => setBlock("h3")}>
          <Heading3 size={16} aria-hidden="true" />
        </button>
        <span className="mx-1 h-6 w-px bg-outline/15" />
        <button type="button" title="Negrito" className={buttonClass} onClick={() => runCommand("bold")}>
          <Bold size={16} aria-hidden="true" />
        </button>
        <button type="button" title="Itálico" className={buttonClass} onClick={() => runCommand("italic")}>
          <Italic size={16} aria-hidden="true" />
        </button>
        <button type="button" title="Sublinhado" className={buttonClass} onClick={() => runCommand("underline")}>
          <Underline size={16} aria-hidden="true" />
        </button>
        <button type="button" title="Link" className={buttonClass} onClick={addLink}>
          <LinkIcon size={16} aria-hidden="true" />
        </button>
        <span className="mx-1 h-6 w-px bg-outline/15" />
        <button type="button" title="Lista" className={buttonClass} onClick={() => runCommand("insertUnorderedList")}>
          <List size={16} aria-hidden="true" />
        </button>
        <button type="button" title="Lista numerada" className={buttonClass} onClick={() => runCommand("insertOrderedList")}>
          <ListOrdered size={16} aria-hidden="true" />
        </button>
        <button type="button" title="Citação" className={buttonClass} onClick={() => setBlock("blockquote")}>
          <Quote size={16} aria-hidden="true" />
        </button>
        <span className="mx-1 h-6 w-px bg-outline/15" />
        <button type="button" title="Desfazer" className={buttonClass} onClick={() => runCommand("undo")}>
          <Undo2 size={16} aria-hidden="true" />
        </button>
        <button type="button" title="Refazer" className={buttonClass} onClick={() => runCommand("redo")}>
          <Redo2 size={16} aria-hidden="true" />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="blog-rich-editor min-h-80 rounded-xl px-4 py-4 text-sm text-on-surface outline-none"
        data-placeholder="Escreva o artigo aqui..."
        dangerouslySetInnerHTML={{ __html: initialHtml }}
        onInput={syncEditor}
        onBlur={syncEditor}
        onPaste={handlePaste}
      />
    </div>
  );
}
