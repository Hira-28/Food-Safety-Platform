"use client";

import { useActionState } from "react";

type SignInAction = (
  previousState: { error: string } | null | undefined,
  formData: FormData
) => Promise<{ error: string } | undefined>;

export default function SignInForm({ action }: { action: SignInAction }) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="email"
        name="email"
        required
        placeholder="you@diu.edu.bd"
        aria-label="University email address"
        aria-describedby={state?.error ? "sign-in-error" : undefined}
        className="w-full rounded-lg border border-[#1C2B24]/15 bg-white px-4 py-2.5 text-[#1C2B24] placeholder:text-[#1C2B24]/40 focus:outline-none focus:border-[#2F6F4E]"
      />
      {state?.error && (
        <p id="sign-in-error" role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#2F6F4E] text-white text-sm font-medium px-6 py-3 hover:bg-[#255a3f] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send sign-in link"}
      </button>
    </form>
  );
}