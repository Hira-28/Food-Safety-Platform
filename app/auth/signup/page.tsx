"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, UtensilsCrossed } from "lucide-react";
import { signUpAction, type AuthFormState } from "@/lib/actions/auth";

const initialState: AuthFormState = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  return (
    <main className="mx-auto grid min-h-[calc(100vh-12rem)] w-full max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:gap-14 lg:px-8 lg:py-12">
      <section className="relative hidden min-h-[610px] overflow-hidden rounded-[2rem] bg-[#172B23] p-10 text-white shadow-[0_28px_70px_rgba(23,43,35,0.2)] lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_18%,rgba(215,243,107,0.16),transparent_35%),linear-gradient(145deg,#254634,#172B23)]" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full border-[42px] border-white/[0.035]" />
        <div className="relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D7F36B] text-[#172B23]">
            <UtensilsCrossed size={22} aria-hidden="true" />
          </span>
          <p className="mt-9 text-xs font-semibold uppercase tracking-[0.17em] text-[#D7F36B]">
            Join the campus community
          </p>
          <h2 className="mt-3 max-w-lg font-display text-5xl leading-[1.08]">
            Your experience can make dining better for everyone.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-white/65">
            Create an account to share food-safety concerns and follow the
            progress of reports you submit.
          </p>
        </div>
        <div className="relative space-y-3">
          {[
            "Discover restaurants around campus",
            "Submit a concern to the review team",
            "Track updates on your reports",
          ].map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-3 text-sm text-white/80"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D7F36B]/15 text-[#D7F36B]">
                <Check size={14} aria-hidden="true" />
              </span>
              {benefit}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-lg">
        <div className="rounded-[2rem] border border-[#E3EAE2] bg-white p-6 shadow-[0_18px_55px_rgba(23,43,35,0.09)] sm:p-9">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4E9] text-[#2F6F4E] lg:hidden">
            <UtensilsCrossed size={21} aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2F6F4E]">
            Get started
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-[#172B23]">
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#718078]">
            Sign up with your university email to join the community.
          </p>

          <form action={formAction} className="mt-8 space-y-4">
            {[
              {
                id: "signup-name",
                label: "Full name",
                name: "name",
                type: "text",
                autoComplete: "name",
                placeholder: "Your name",
                minLength: undefined,
              },
              {
                id: "signup-email",
                label: "University email",
                name: "email",
                type: "email",
                autoComplete: "email",
                placeholder: "you@diu.edu.bd",
                minLength: undefined,
              },
              {
                id: "signup-password",
                label: "Password",
                name: "password",
                type: "password",
                autoComplete: "new-password",
                placeholder: "At least 8 characters",
                minLength: 8,
              },
              {
                id: "signup-confirm-password",
                label: "Confirm password",
                name: "confirmPassword",
                type: "password",
                autoComplete: "new-password",
                placeholder: "Enter your password again",
                minLength: 8,
              },
            ].map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.id}
                  className="mb-2 block text-sm font-semibold text-[#263B30]"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  name={field.name}
                  autoComplete={field.autoComplete}
                  required
                  minLength={field.minLength}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-[#DCE5DC] bg-[#FAFBF9] px-4 py-3 text-sm text-[#263B30] outline-none transition placeholder:text-[#9AA59D] focus:border-[#2F6F4E] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10"
                />
                {field.name === "password" && (
                  <p className="mt-1.5 text-xs text-[#89958C]">
                    Use at least 8 characters.
                  </p>
                )}
              </div>
            ))}

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
              {pending ? "Creating account..." : "Create student account"}
              {!pending && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </form>

          <div className="mt-6 flex items-start gap-2 rounded-xl bg-[#F5F8F3] p-3 text-xs leading-5 text-[#718078]">
            <ShieldCheck
              size={15}
              className="mt-0.5 shrink-0 text-[#2F6F4E]"
              aria-hidden="true"
            />
            Your report details are shared with the university review team to
            support follow-up.
          </div>

          <p className="mt-6 border-t border-[#EDF0EC] pt-5 text-center text-sm text-[#718078]">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-[#2F6F4E] hover:text-[#214F38]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}