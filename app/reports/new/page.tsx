import { Suspense } from "react";
import { db } from "@/lib/db";
import { restaurants } from "@/lib/db/schema";
import { ReportForm } from "@/components/report-form";
import { requireStudent } from "@/lib/auth-helpers";
import { ClipboardPenLine, ShieldCheck } from "lucide-react";

export default async function NewReportPage() {
  await requireStudent();

  const allRestaurants = await db
    .select({ id: restaurants.id, name: restaurants.name })
    .from(restaurants);

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:px-8">
      <section>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#172B23] p-6 text-white shadow-[0_18px_50px_rgba(23,43,35,0.16)] sm:p-9">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[28px] border-white/[0.04]" />
          <div className="relative flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D7F36B] text-[#172B23]">
              <ClipboardPenLine size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D7F36B]">
                Your voice makes a difference
              </p>
              <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                Report a food-safety issue
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Share what happened so the university proctorial team can
                review it and follow up.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-5 rounded-3xl border border-[#E3EAE2] bg-white p-5 shadow-[0_8px_30px_rgba(23,43,35,0.045)] sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-[#EDF0EC] pb-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF4E9] text-[#2F6F4E]">
              <span className="text-sm font-bold">01</span>
            </span>
            <div>
              <h2 className="text-sm font-semibold text-[#263B30]">
                Tell us what you noticed
              </h2>
              <p className="mt-0.5 text-xs text-[#87928A]">
                Fields marked required must be completed.
              </p>
            </div>
          </div>
          <Suspense fallback={null}>
            <ReportForm restaurants={allRestaurants} />
          </Suspense>
        </section>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="rounded-3xl border border-[#DCE5DC] bg-[#F0F5EC] p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2F6F4E] shadow-sm">
            <ShieldCheck size={19} aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-xl text-[#20342A]">
            What happens next?
          </h2>
          <ol className="mt-4 space-y-4">
            {[
              "Your report is sent to the university proctorial team.",
              "Staff review the details and may update the report status.",
              "Follow progress anytime from My Reports.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-5 text-[#627067]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DCE9D6] text-xs font-bold text-[#2F6F4E]">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-3xl border border-[#E3EAE2] bg-white p-5">
          <p className="text-sm font-semibold text-[#263B30]">
            Helpful details
          </p>
          <p className="mt-2 text-sm leading-6 text-[#718078]">
            Include what happened, when you noticed it, and any details that
            could help the team understand your concern.
          </p>
        </div>
      </aside>
    </main>
  );
}