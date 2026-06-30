"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Send, Star } from "lucide-react";
import {
  submitBlogTestimonialAction,
  type BlogTestimonialFormState,
} from "./testimonial-actions";

const initialState: BlogTestimonialFormState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(148_53_21)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[rgb(120_42_16)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Send size={16} />
      {pending ? "Enviando..." : "Enviar para moderacao"}
    </button>
  );
}

type BlogTestimonialFormProps = {
  postId: string;
  postSlug: string;
};

export function BlogTestimonialForm({ postId, postSlug }: BlogTestimonialFormProps) {
  const [state, formAction] = useActionState(submitBlogTestimonialAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <section className="mt-16 rounded-[24px] border border-outline/30 bg-[#fffaf4] p-6 md:p-8">
      <div className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[rgb(148_53_21)]">
          Depoimentos
        </p>
        <h2 className="mt-2 font-serif text-3xl text-on-surface">
          Conte sua experiencia com esta materia
        </h2>
        <p className="mt-3 text-sm leading-7 text-on-surface/70">
          Seu comentario sera enviado para moderacao no painel administrativo antes de ser publicado.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-5">
        <input type="hidden" name="blog_post_id" value={postId} />
        <input type="hidden" name="blog_post_slug" value={postSlug} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="testimonial-author-name" className="mb-1 block text-sm font-medium">
              Nome *
            </label>
            <input
              id="testimonial-author-name"
              name="author_name"
              required
              maxLength={120}
              className="w-full rounded-xl border border-outline bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[rgb(148_53_21)] focus:ring-2 focus:ring-[rgb(148_53_21)]/15"
            />
          </div>

          <div>
            <label htmlFor="testimonial-author-role" className="mb-1 block text-sm font-medium">
              Bairro, negocio ou relacao
            </label>
            <input
              id="testimonial-author-role"
              name="author_role"
              maxLength={140}
              className="w-full rounded-xl border border-outline bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[rgb(148_53_21)] focus:ring-2 focus:ring-[rgb(148_53_21)]/15"
            />
          </div>
        </div>

        <div>
          <label htmlFor="testimonial-rating" className="mb-1 block text-sm font-medium">
            Nota
          </label>
          <div className="relative max-w-40">
            <Star className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(148_53_21)]" size={16} />
            <select
              id="testimonial-rating"
              name="rating"
              defaultValue=""
              className="w-full appearance-none rounded-xl border border-outline bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[rgb(148_53_21)] focus:ring-2 focus:ring-[rgb(148_53_21)]/15"
            >
              <option value="">Sem nota</option>
              <option value="5">5 estrelas</option>
              <option value="4">4 estrelas</option>
              <option value="3">3 estrelas</option>
              <option value="2">2 estrelas</option>
              <option value="1">1 estrela</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="testimonial-content" className="mb-1 block text-sm font-medium">
            Depoimento *
          </label>
          <textarea
            id="testimonial-content"
            name="content"
            required
            rows={5}
            maxLength={1200}
            className="w-full rounded-xl border border-outline bg-white px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-[rgb(148_53_21)] focus:ring-2 focus:ring-[rgb(148_53_21)]/15"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SubmitButton />
          {state.message ? (
            <p
              aria-live="polite"
              className={`text-sm ${
                state.status === "success" ? "text-green-700" : "text-error"
              }`}
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
