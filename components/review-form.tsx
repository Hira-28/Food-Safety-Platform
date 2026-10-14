"use client";

import { useActionState } from "react";
import { createReview } from "@/lib/actions/reviews";

export function ReviewForm({ restaurantId }: { restaurantId: string }) {
  const [state, formAction, pending] = useActionState(createReview, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="restaurantId" value={restaurantId} />

      <div>
        <label
          htmlFor="review-rating"
          className="mb-2 block text-sm font-semibold text-[#263B30]"
        >
          Rating <span className="text-[#B54E3D]">*</span>
        </label>
        <select
          id="review-rating"
          name="rating"
          required
          defaultValue=""
          className="w-full rounded-xl border border-[#DCE5DC] bg-[#FAFBF9] px-4 py-3 text-sm text-[#263B30] outline-none transition focus:border-[#2F6F4E] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10"
        >
          <option value="" disabled>
            Select a rating
          </option>
          <option value="5">5 — Excellent</option>
          <option value="4">4 — Good</option>
          <option value="3">3 — Average</option>
          <option value="2">2 — Poor</option>
          <option value="1">1 — Very poor</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="review-body"
          className="mb-2 block text-sm font-semibold text-[#263B30]"
        >
          আপনার রিভিউ লিখুন
        </label>
        <textarea
          id="review-body"
          name="body"
          lang="bn"
          required
          minLength={2}
          maxLength={2000}
          rows={4}
          placeholder="আপনার খাবার ও অভিজ্ঞতা সম্পর্কে লিখুন..."
          className="w-full resize-y rounded-xl border border-[#DCE5DC] bg-[#FAFBF9] px-4 py-3 text-sm leading-6 text-[#263B30] outline-none transition placeholder:text-[#9AA59D] focus:border-[#2F6F4E] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10"
        />
        <p className="mt-1 text-xs text-[#87928A]">
          You can write in বাংলা or English (2–2,000 characters).
        </p>
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-xl border border-[#F0D4CA] bg-[#FFF4EF] px-4 py-3 text-sm text-[#A34530]"
        >
          {state.error}
        </p>
      )}
      {state?.success && (
        <p
          role="status"
          className="rounded-xl border border-[#CFE0CD] bg-[#F1F7EF] px-4 py-3 text-sm text-[#2F6F4E]"
        >
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-xl bg-[#203B2E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2F6F4E] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
