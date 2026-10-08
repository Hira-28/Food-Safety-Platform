"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type AuthFormState } from "@/lib/actions/auth";

const initialState: AuthFormState = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  return (
    <main className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-[#1C2B24] mb-2">
        Create your account
      </h1>
      <p className="text-[#1C2B24]/60 mb-8">
        Use your university email to sign up.
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1C2B24] mb-1.5">
            Full name
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-lg border border-[#1C2B24]/15 bg-white px-4 py-2.5 text-[#1C2B24] focus:outline-none focus:border-[#2F6F4E]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C2B24] mb-1.5">
            University email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@diu.edu.bd"
            className="w-full rounded-lg border border-[#1C2B24]/15 bg-white px-4 py-2.5 text-[#1C2B24] placeholder:text-[#1C2B24]/40 focus:outline-none focus:border-[#2F6F4E]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C2B24] mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full rounded-lg border border-[#1C2B24]/15 bg-white px-4 py-2.5 text-[#1C2B24] focus:outline-none focus:border-[#2F6F4E]"
          />
          <p className="text-xs text-[#1C2B24]/40 mt-1">At least 8 characters.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C2B24] mb-1.5">
            Confirm password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            className="w-full rounded-lg border border-[#1C2B24]/15 bg-white px-4 py-2.5 text-[#1C2B24] focus:outline-none focus:border-[#2F6F4E]"
          />
        </div>

        {state.error && <p className="text-sm text-[#B54E3D]">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#2F6F4E] text-white text-sm font-medium px-6 py-3 hover:bg-[#255a3f] transition-colors disabled:opacity-50"
        >
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-[#1C2B24]/60 mt-6 text-center">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-[#2F6F4E] font-medium">
          Sign in
        </Link>
      </p>
    </main>
  );
}