"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Paragraph from "@tiptap/extension-paragraph";
import { saveBlogDraftAction } from "./actions";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Code2, Eraser, Highlighter,
  Image as ImageIcon, Italic, Link as LinkIcon, List, ListOrdered, Palette,
  Quote, Redo2, Strikethrough, Underline as UnderlineIcon, Undo2,
} from "lucide-react";

type BlogContentEditorProps = {
  name?: string;
  defaultValue?: string;
  postId?: string;
};

const editorImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null },
    };
  },
});

const editorParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: { default: null },
    };
  },
});

function markdownToHtml(value: string) {
  const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return value
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.trim().split("\n").filter(Boolean);
      if (!lines.length) return "";
      const heading = lines[0].match(/^(#{1,3})\s+(.+)$/);
      if (heading) return `<h${heading[1].length}>${escape(heading[2])}</h${heading[1].length}>`;
      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        return `<ul>${lines.map((line) => `<li><p>${escape(line.replace(/^[-*]\s+/, ""))}</p></li>`).join("")}</ul>`;
      }
      if (lines.every((line) => /^\d+\.\s+/.test(line))) {
        return `<ol>${lines.map((line) => `<li><p>${escape(line.replace(/^\d+\.\s+/, ""))}</p></li>`).join("")}</ol>`;
      }
      return `<p>${lines.map(escape).join("<br>")}</p>`;
    })
    .join("");
}

function initialContent(value: string) {
  const trimmed = value.trim();
  return !trimmed ? "" : /<\/?[a-z][\s\S]*>/i.test(trimmed) ? trimmed : markdownToHtml(trimmed);
}

export function BlogContentEditor({ name = "content_md", defaultValue = "", postId }: BlogContentEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(() => initialContent(defaultValue));
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [imageError, setImageError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, paragraph: false }),
      editorParagraph,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph", "blockquote", "listItem"] }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      editorImage.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder: "Escreva o artigo aqui..." }),
    ],
    content: initialContent(defaultValue),
    editorProps: {
      attributes: {
        class: "blog-rich-editor min-h-80 rounded-xl px-4 py-4 text-sm text-on-surface outline-none",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "Conteúdo do artigo",
      },
      handleDoubleClick: (_view, _pos, event) => {
        const target = event.target;
        if (target instanceof HTMLAnchorElement) {
          const nextUrl = window.prompt("Editar URL do link", target.href);
          if (nextUrl) editor?.chain().focus().setLink({ href: nextUrl }).run();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      const nextHtml = nextEditor.getHTML();
      setHtml(nextHtml === "<p></p>" ? "" : nextHtml);
      setSaveState("idle");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void autosave(nextHtml === "<p></p>" ? "" : nextHtml);
      }, 1500);
    },
  });

  async function autosave(value: string) {
    const key = `menu-zn-blog-draft:${postId ?? "new"}`;
    if (!postId) {
      localStorage.setItem(key, value);
      setSaveState("saved");
      return;
    }
    setSaveState("saving");
    try {
      await saveBlogDraftAction(postId, value);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  useEffect(() => {
    if (!editor || postId) return;
    const draft = localStorage.getItem("menu-zn-blog-draft:new");
    if (draft && !defaultValue.trim()) {
      editor.commands.setContent(draft);
    }
  }, [editor, postId, defaultValue]);

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/") || file.size > 4 * 1024 * 1024) {
      setImageError("Use uma imagem válida de até 4 MB.");
      return;
    }
    setIsUploadingImage(true);
    setImageError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/admin/blog/images", { method: "POST", body: formData });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Não foi possível enviar a imagem.");
      editor?.chain().focus().setImage({ src: result.url, alt: file.name.replace(/\.[^/.]+$/, "") }).run();
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  function addImageByUrl() {
    const url = window.prompt("Cole a URL da imagem");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  function addLink() {
    const url = window.prompt("Cole a URL do link");
    if (url) editor?.chain().focus().extendMarkRange("link").setLink({ href: /^https?:\/\//i.test(url) ? url : `https://${url}` }).run();
  }

  function updateBlockStyle(style: Record<string, string>) {
    editor?.chain().focus().updateAttributes("paragraph", { style: Object.entries(style).map(([key, value]) => `${key}: ${value}`).join("; ") }).run();
  }

  const buttonClass = "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline/20 bg-white text-on-surface/75 transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:opacity-40";
  const selectClass = "h-9 rounded-lg border border-outline/20 bg-white px-2 text-xs font-medium text-on-surface/75 outline-none focus-visible:ring-2 focus-visible:ring-primary/25";
  const iconProps = { size: 16, "aria-hidden": true } as const;

  return (
    <div className="rounded-2xl border border-outline/20 bg-[#faf8f5] p-2" onSubmitCapture={() => { if (!postId) localStorage.removeItem("menu-zn-blog-draft:new"); }}>
      <input type="hidden" name={name} value={html} />
      <input ref={imageInputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void uploadImage(file); }} />
      <div className="sticky top-16 z-30 -mt-2 mb-2 flex flex-wrap items-center gap-1.5 border-b border-outline/10 bg-[#faf8f5] px-1 pb-2 pt-2" role="toolbar" aria-label="Formatação do texto">
        <select className={selectClass} aria-label="Estilo do bloco" defaultValue="p" onChange={(event) => { const level = event.target.value; if (level === "p") editor?.chain().focus().setParagraph().run(); else editor?.chain().focus().toggleHeading({ level: Number(level) as 1 | 2 | 3 }).run(); }}>
          <option value="p">Parágrafo</option><option value="1">Título 1</option><option value="2">Título 2</option><option value="3">Título 3</option>
        </select>
        <button type="button" title="Negrito (Ctrl+B)" aria-label="Negrito" className={buttonClass} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold {...iconProps} /></button>
        <button type="button" title="Itálico (Ctrl+I)" aria-label="Itálico" className={buttonClass} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic {...iconProps} /></button>
        <button type="button" title="Sublinhado (Ctrl+U)" aria-label="Sublinhado" className={buttonClass} onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon {...iconProps} /></button>
        <button type="button" title="Tachado" aria-label="Tachado" className={buttonClass} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough {...iconProps} /></button>
        <label title="Cor do texto" className={`${buttonClass} cursor-pointer`}><Palette {...iconProps} /><input type="color" className="sr-only" defaultValue="#943515" onChange={(event) => editor?.chain().focus().setColor(event.target.value).run()} /></label>
        <label title="Destaque" className={`${buttonClass} cursor-pointer`}><Highlighter {...iconProps} /><input type="color" className="sr-only" defaultValue="#ffe08a" onChange={(event) => editor?.chain().focus().toggleHighlight({ color: event.target.value }).run()} /></label>
        <span className="mx-1 h-6 w-px bg-outline/15" />
        <button type="button" title="Alinhar à esquerda" aria-label="Alinhar à esquerda" className={buttonClass} onClick={() => editor?.chain().focus().setTextAlign("left").run()}><AlignLeft {...iconProps} /></button>
        <button type="button" title="Centralizar" aria-label="Centralizar" className={buttonClass} onClick={() => editor?.chain().focus().setTextAlign("center").run()}><AlignCenter {...iconProps} /></button>
        <button type="button" title="Alinhar à direita" aria-label="Alinhar à direita" className={buttonClass} onClick={() => editor?.chain().focus().setTextAlign("right").run()}><AlignRight {...iconProps} /></button>
        <button type="button" title="Justificar" aria-label="Justificar" className={buttonClass} onClick={() => editor?.chain().focus().setTextAlign("justify").run()}><AlignJustify {...iconProps} /></button>
        <select className={selectClass} aria-label="Espaçamento" defaultValue="1.8" onChange={(event) => updateBlockStyle({ "line-height": event.target.value })}><option value="1.4">Linha 1.4</option><option value="1.8">Linha 1.8</option><option value="2">Linha 2.0</option></select>
        <select className={selectClass} aria-label="Recuo" defaultValue="0" onChange={(event) => updateBlockStyle({ "margin-left": `${event.target.value}rem` })}><option value="0">Sem recuo</option><option value="2">Recuo 1</option><option value="4">Recuo 2</option><option value="6">Recuo 3</option></select>
        <span className="mx-1 h-6 w-px bg-outline/15" />
        <button type="button" title="Lista com marcadores" aria-label="Lista com marcadores" className={buttonClass} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List {...iconProps} /></button>
        <button type="button" title="Lista numerada" aria-label="Lista numerada" className={buttonClass} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered {...iconProps} /></button>
        <button type="button" title="Citação" aria-label="Citação" className={buttonClass} onClick={() => editor?.chain().focus().toggleBlockquote().run()}><Quote {...iconProps} /></button>
        <button type="button" title="Código" aria-label="Código" className={buttonClass} onClick={() => editor?.chain().focus().toggleCode().run()}><Code2 {...iconProps} /></button>
        <button type="button" title="Link" aria-label="Link" className={buttonClass} onClick={addLink}><LinkIcon {...iconProps} /></button>
        <button type="button" title="Imagem por URL" aria-label="Imagem por URL" className={buttonClass} onClick={addImageByUrl}><LinkIcon {...iconProps} /></button>
        <button type="button" title="Enviar imagem" aria-label="Enviar imagem" className={buttonClass} disabled={isUploadingImage} onClick={() => imageInputRef.current?.click()}><ImageIcon {...iconProps} /></button>
        <select className={selectClass} aria-label="Largura da imagem" defaultValue="" onChange={(event) => { if (event.target.value) editor?.chain().focus().updateAttributes("image", { width: event.target.value }).run(); }}><option value="">Imagem</option><option value="100%">100%</option><option value="75%">75%</option><option value="50%">50%</option></select>
        <button type="button" title="Limpar formatação" aria-label="Limpar formatação" className={buttonClass} onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}><Eraser {...iconProps} /></button>
        <span className="mx-1 h-6 w-px bg-outline/15" />
        <button type="button" title="Desfazer" aria-label="Desfazer" className={buttonClass} onClick={() => editor?.chain().focus().undo().run()}><Undo2 {...iconProps} /></button>
        <button type="button" title="Refazer" aria-label="Refazer" className={buttonClass} onClick={() => editor?.chain().focus().redo().run()}><Redo2 {...iconProps} /></button>
      </div>
      <p className={`px-2 pt-2 text-xs ${imageError ? "text-red-700" : "text-on-surface/55"}`} aria-live="polite">{imageError || (isUploadingImage ? "Enviando imagem..." : saveState === "saving" ? "Salvando rascunho..." : saveState === "saved" ? "Rascunho salvo" : saveState === "error" ? "Não foi possível salvar o rascunho" : "Duplo clique em um link para editá-lo rapidamente.")}</p>
      <EditorContent editor={editor} />
    </div>
  );
}