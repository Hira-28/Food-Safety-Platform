"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, UtensilsCrossed } from "lucide-react";
import { signInAction, type AuthFormState } from "@/lib/actions/auth";

const initialState: AuthFormState = {};

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <main className="mx-auto grid min-h-[calc(100vh-12rem)] w-full max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:gap-14 lg:px-8 lg:py-12">
      <section className="relative hidden min-h-[570px] overflow-hidden rounded-[2rem] bg-[#172B23] p-10 text-white shadow-[0_28px_70px_rgba(23,43,35,0.2)] lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_25%,rgba(215,243,107,0.18),transparent_35%),linear-gradient(145deg,#172B23,#2F5039)]" />
        <div className="absolute -bottom-20 -right-12 h-80 w-80 rounded-full border-[42px] border-white/[0.035]" />
        <div className="relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D7F36B] text-[#172B23]">
            <UtensilsCrossed size={22} aria-hidden="true" />
          </span>
          <p className="mt-9 text-xs font-semibold uppercase tracking-[0.17em] text-[#D7F36B]">
            Campus Eats community
          </p>
          <h2 className="mt-3 max-w-lg font-display text-5xl leading-[1.08]">
            Better meals begin with a little more confidence.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-white/65">
            Explore campus restaurants, share your experience, and help your
            community make informed choices.
          </p>
        </div>
        <div className="relative grid gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#D7F36B]">
              <ShieldCheck size={19} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Your voice matters</p>
              <p className="mt-0.5 text-xs text-white/55">
                Reports go to the university review team.
              </p>
            </div>
            <Sparkles className="ml-auto text-[#D7F36B]" size={17} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md">
        <div className="rounded-[2rem] border border-[#E3EAE2] bg-white p-6 shadow-[0_18px_55px_rgba(23,43,35,0.09)] sm:p-9">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4E9] text-[#2F6F4E] lg:hidden">
            <UtensilsCrossed size={21} aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2F6F4E]">
            Welcome back
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-[#172B23]">
            Sign in
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#718078]">
            Use your university email and password to continue.
          </p>

          <form action={formAction} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="signin-email"
                className="mb-2 block text-sm font-semibold text-[#263B30]"
              >
                University email
              </label>
              <input
                id="signin-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="you@diu.edu.bd"
                className="w-full rounded-xl border border-[#DCE5DC] bg-[#FAFBF9] px-4 py-3 text-sm text-[#263B30] outline-none transition placeholder:text-[#9AA59D] focus:border-[#2F6F4E] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10"
              />
            </div>

            <div>
              <label
                htmlFor="signin-password"
                className="mb-2 block text-sm font-semibold text-[#263B30]"
              >
                Password
              </label>
              <input
                id="signin-password"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-[#DCE5DC] bg-[#FAFBF9] px-4 py-3 text-sm text-[#263B30] outline-none transition focus:border-[#2F6F4E] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10"
              />
            </div>

            {state.error && (
              <p
                role="alert"
                className="rounded-xl border border-[#F0D4CA] bg-[#FFF4EF] px-4 py-3 text-sm text-[#A34530]"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#203B2E] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2F6F4E] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6F4E] disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? "Signing in..." : "Continue to Campus Eats"}
              {!pending && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-7 border-t border-[#EDF0EC] pt-6 text-center text-sm text-[#718078]">
            New to Campus Eats?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-[#2F6F4E] hover:text-[#214F38]"
            >
              Create an account
            </Link>
          </p>
        </div>
        <p className="mt-5 text-center text-xs text-[#89958C]">
          Your account helps keep campus dining informed and accountable.
        </p>
      </section>
    </main>
  );
}