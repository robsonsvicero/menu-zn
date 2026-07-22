"use client";

import { type ChangeEvent, type ClipboardEvent, type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  LoaderCircle,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";
import { sanitizeStyleAttribute } from "@/lib/html-style-sanitize";

type BlogContentEditorProps = {
  name?: string;
  defaultValue?: string;
};

const allowedTags = new Set([
  "A",
  "B",
  "BLOCKQUOTE",
  "BR",
  "CENTER",
  "DEL",
  "DIV",
  "EM",
  "H2",
  "H3",
  "I",
  "IMG",
  "LI",
  "OL",
  "P",
  "S",
  "SPAN",
  "STRONG",
  "SUB",
  "SUP",
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
      const isAllowedImage = element.tagName === "IMG" &&
        ["src", "alt", "title", "loading"].includes(name);

      const isAllowedStyle = name === "style";

      if (!isAllowedLink && !isAllowedImage && !isAllowedStyle) {
        element.removeAttribute(attribute.name);
      }
    });

    const style = element.getAttribute("style");

    if (style) {
      const sanitizedStyle = sanitizeStyleAttribute(style);

      if (sanitizedStyle) {
        element.setAttribute("style", sanitizedStyle);
      } else {
        element.removeAttribute("style");
      }
    }

    if (element.tagName === "A") {
      const href = element.getAttribute("href") ?? "";
      const isSafeHref = /^(https?:\/\/|mailto:)/i.test(href);

      if (!isSafeHref) {
        element.removeAttribute("href");
      }

      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noreferrer");
    }

    if (element.tagName === "IMG") {
      const src = element.getAttribute("src") ?? "";

      if (!/^https?:\/\//i.test(src)) {
        element.remove();
        return;
      }

      element.setAttribute("loading", "lazy");
      element.setAttribute("alt", element.getAttribute("alt") ?? "");
    }
  });

  return template.innerHTML;
}

function normalizeEditorHtml(value: string) {
  const sanitized = sanitizeHtml(value);

  if (typeof window === "undefined" || !sanitized.trim()) {
    return sanitized.trim();
  }

  const template = document.createElement("template");
  template.innerHTML = sanitized;
  const hasMeaningfulElement = template.content.querySelector("img, iframe, video, audio, table, hr");
  const text = template.content.textContent?.replace(/\u00a0/g, " ").trim() ?? "";

  return text || hasMeaningfulElement ? sanitized : "";
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
      heading.setAttribute("style", element.getAttribute("style") ?? "");
      element.replaceWith(heading);
      return;
    }

    if (["H4", "H5", "H6"].includes(tagName)) {
      const heading = document.createElement("h3");
      heading.replaceChildren(...Array.from(element.childNodes));
      heading.setAttribute("style", element.getAttribute("style") ?? "");
      element.replaceWith(heading);
      return;
    }

    if (tagName === "FONT") {
      const span = document.createElement("span");
      const styles: string[] = [];
      const color = element.getAttribute("color");
      const size = element.getAttribute("size");

      if (color) {
        styles.push(`color: ${color}`);
      }

      if (size && /^\d+$/.test(size)) {
        const sizeMap: Record<string, string> = {
          "1": "10pt",
          "2": "12pt",
          "3": "14pt",
          "4": "16pt",
          "5": "18pt",
          "6": "24pt",
          "7": "32pt",
        };

        styles.push(`font-size: ${sizeMap[size] ?? "14pt"}`);
      }

      span.setAttribute("style", styles.join("; "));
      span.replaceChildren(...Array.from(element.childNodes));
      element.replaceWith(span);
      return;
    }

    if (tagName === "CENTER") {
      const div = document.createElement("div");
      div.setAttribute("style", "text-align: center");
      div.replaceChildren(...Array.from(element.childNodes));
      element.replaceWith(div);
      return;
    }

    if (tagName === "O:P") {
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
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageSelectionRef = useRef<Range | null>(null);
  const selectedImageRef = useRef<HTMLImageElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  function setSelectedImage(image: HTMLImageElement | null) {
    const previous = selectedImageRef.current;
    if (previous && previous !== image) {
      previous.removeAttribute("data-editor-selected");
    }

    if (image) {
      image.setAttribute("data-editor-selected", "true");
      selectedImageRef.current = image;
      return;
    }

    selectedImageRef.current = null;
  }

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.innerHTML = initialHtml;
    setSelectedImage(null);
    setHtml(normalizeEditorHtml(initialHtml));
  }, [initialHtml]);

  function syncEditor() {
    const editor = editorRef.current;
    const nextHtml = normalizeEditorHtml(editor?.innerHTML ?? "");

    if (editor && !nextHtml && editor.innerHTML) {
      editor.replaceChildren();
    }

    setHtml(nextHtml);
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
    syncEditor();
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

  function rememberImagePosition() {
    const editor = editorRef.current;
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

    imageSelectionRef.current = range && editor?.contains(range.commonAncestorContainer)
      ? range.cloneRange()
      : null;
  }

  function getSelectedImage() {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (!editor || !selection) {
      return null;
    }

    const selectedImage = selectedImageRef.current;
    if (selectedImage && editor.contains(selectedImage)) {
      return selectedImage;
    }

    const findImage = (node: Node | null): HTMLImageElement | null => {
      if (!node) {
        return null;
      }

      if (node instanceof HTMLImageElement) {
        return node;
      }

      if (node instanceof Element) {
        if (node.tagName === "IMG") {
          return node as HTMLImageElement;
        }

        return node.closest("img");
      }

      return node.parentElement?.closest("img") ?? null;
    };

    const image =
      findImage(selection.anchorNode) ??
      findImage(selection.focusNode) ??
      (selection.rangeCount ? findImage(selection.getRangeAt(0).commonAncestorContainer) : null);

    const finalImage = image && editor.contains(image) ? image : null;

    setSelectedImage(finalImage);
    return finalImage;
  }

  function handleEditorMouseDown(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;

    if (target instanceof HTMLImageElement) {
      setSelectedImage(target);
      setImageError("");
      return;
    }

    setSelectedImage(null);
  }

  function applyImageStyles(updateStyles: (image: HTMLImageElement) => void) {
    const image = getSelectedImage();

    if (!image) {
      setImageError("Selecione uma imagem no editor para ajustar tamanho/alinhamento.");
      return;
    }

    updateStyles(image);

    const sanitizedStyle = sanitizeStyleAttribute(image.getAttribute("style") ?? "");
    if (sanitizedStyle) {
      image.setAttribute("style", sanitizedStyle);
    } else {
      image.removeAttribute("style");
    }

    setImageError("");
    syncEditor();
  }

  function setImageSize(size: "small" | "medium" | "large") {
    const widthBySize: Record<typeof size, string> = {
      small: "48%",
      medium: "72%",
      large: "100%",
    };

    applyImageStyles((image) => {
      image.style.width = widthBySize[size];
      image.style.maxWidth = "100%";
      image.style.height = "auto";
    });
  }

  function setImageAlign(align: "left" | "center" | "right") {
    applyImageStyles((image) => {
      image.style.marginLeft = align === "left" ? "0" : "auto";
      image.style.marginRight = align === "right" ? "0" : "auto";
    });
  }

  function resetImageStyles() {
    applyImageStyles((image) => {
      image.style.width = "100%";
      image.style.maxWidth = "100%";
      image.style.height = "auto";
      image.style.marginLeft = "auto";
      image.style.marginRight = "auto";
    });
  }

  function deleteSelectedImage() {
    const image = getSelectedImage();

    if (!image) {
      setImageError("Selecione uma imagem no editor para excluir.");
      return;
    }

    const paragraph = image.parentElement?.tagName === "P" ? image.parentElement : null;
    image.remove();

    if (paragraph && paragraph.textContent?.trim() === "" && paragraph.querySelector("img") === null) {
      paragraph.remove();
    }

    setSelectedImage(null);
    setImageError("");
    syncEditor();
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Selecione um arquivo de imagem v?lido.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("A imagem deve ter no m?ximo 5 MB.");
      return;
    }

    setImageError("");
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/admin/blog/images", { method: "POST", body: formData });
      const result = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "N?o foi poss?vel enviar a imagem.");
      }

      const selection = window.getSelection();
      const savedRange = imageSelectionRef.current;
      if (selection && savedRange) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }

      const alt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
      const editor = editorRef.current;
      if (editor) {
        insertHtmlAtSelection(editor, `<img src="${escapeHtml(result.url)}" alt="${escapeHtml(alt)}" loading="lazy" style="width: 100%; max-width: 100%; height: auto; margin-left: auto; margin-right: auto;"><p><br></p>`);
        syncEditor();
        const insertedImages = editor.querySelectorAll("img");
        const insertedImage = insertedImages.item(insertedImages.length - 1);
        setSelectedImage(insertedImage instanceof HTMLImageElement ? insertedImage : null);
      }
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "N?o foi poss?vel enviar a imagem.");
    } finally {
      setIsUploadingImage(false);
      imageSelectionRef.current = null;
    }
  }
  const buttonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline/20 bg-white text-on-surface/75 transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25";
  const imageActionButtonClass =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-outline/20 bg-white px-2 text-xs font-semibold text-on-surface/75 transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25";

  return (
    <div className="rounded-2xl border border-outline/20 bg-[#faf8f5] p-2">
      <input type="hidden" name={name} value={html} />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        tabIndex={-1}
        onChange={uploadImage}
      />
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
        <button
          type="button"
          title="Enviar e inserir imagem"
          aria-label="Enviar e inserir imagem"
          className={buttonClass}
          disabled={isUploadingImage}
          onMouseDown={rememberImagePosition}
          onClick={() => imageInputRef.current?.click()}
        >
          {isUploadingImage ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <ImageIcon size={16} aria-hidden="true" />}
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
        <span className="mx-1 h-6 w-px bg-outline/15" />
        <span className="px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-on-surface/45">Imagem</span>
        <button type="button" title="Imagem pequena" className={imageActionButtonClass} onClick={() => setImageSize("small")}>
          P
        </button>
        <button type="button" title="Imagem média" className={imageActionButtonClass} onClick={() => setImageSize("medium")}>
          M
        </button>
        <button type="button" title="Imagem grande" className={imageActionButtonClass} onClick={() => setImageSize("large")}>
          G
        </button>
        <button type="button" title="Alinhar imagem à esquerda" className={imageActionButtonClass} onClick={() => setImageAlign("left")}>
          Esq
        </button>
        <button type="button" title="Alinhar imagem ao centro" className={imageActionButtonClass} onClick={() => setImageAlign("center")}>
          Ctr
        </button>
        <button type="button" title="Alinhar imagem à direita" className={imageActionButtonClass} onClick={() => setImageAlign("right")}>
          Dir
        </button>
        <button type="button" title="Resetar imagem" className={imageActionButtonClass} onClick={resetImageStyles}>
          Reset
        </button>
        <button type="button" title="Deletar imagem" className={imageActionButtonClass} onClick={deleteSelectedImage}>
          Del
        </button>
      </div>

      <p className={`px-2 pt-2 text-xs ${imageError ? "text-red-700" : "text-on-surface/55"}`} aria-live="polite">
        {imageError || (isUploadingImage ? "Enviando imagem..." : "Imagens: JPG, PNG, WebP, GIF ou AVIF, at? 5 MB.")}
      </p>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="blog-rich-editor min-h-80 rounded-xl px-4 py-4 text-sm text-on-surface outline-none"
        data-placeholder="Escreva o artigo aqui..."
        onInput={syncEditor}
        onBlur={syncEditor}
        onPaste={handlePaste}
        onMouseDown={handleEditorMouseDown}
      />
    </div>
  );
}
