import Image from "next/image";
import Link from "next/link";
import { eq, desc, and, inArray, avg, count } from "drizzle-orm";
import { notFound } from "next/navigation";
import { currentUserRole } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { restaurants, reports, reviews } from "@/lib/db/schema";
import { ReviewForm } from "@/components/review-form";
import { REPORT_TYPES } from "@/lib/report-types";
import {
  REPORT_STATUSES,
  PUBLIC_STATUSES,
  STATUS_TONE_CLASSES,
} from "@/lib/report-status";
import { normalizePublicImageUrl } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, ShieldAlert, Star } from "lucide-react";

export default async function RestaurantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reported?: string }>;
}) {
  const { id } = await params;
  const { reported } = await searchParams;
  const role = await currentUserRole();
  const isOfficer = role === "officer" || role === "super_admin";
  const isStudent = role === "student";

  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, id));

  if (!restaurant) {
    notFound();
  }

  const [restaurantReports, restaurantReviews, reviewSummary] =
    await Promise.all([
      db
        .select()
        .from(reports)
        .where(
          and(
            eq(reports.restaurantId, id),
            inArray(reports.status, PUBLIC_STATUSES)
          )
        )
        .orderBy(desc(reports.createdAt)),
      db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          body: reviews.body,
          createdAt: reviews.createdAt,
          
        })
        .from(reviews)
        .where(eq(reviews.restaurantId, id))
        .orderBy(desc(reviews.createdAt)),
      db
        .select({
          rating: avg(reviews.rating),
          reviewCount: count(reviews.id),
        })
        .from(reviews)
        .where(eq(reviews.restaurantId, id)),
    ]);

  const rating = Number(reviewSummary[0]?.rating ?? 0);
  const reviewCount = reviewSummary[0]?.reviewCount ?? 0;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#68766D] transition-colors hover:text-[#2F6F4E]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to restaurant directory
      </Link>

      {reported === "true" && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-[#CFE0CD] bg-[#F1F7EF] px-4 py-4 text-sm text-[#2F6F4E]"
        >
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#2F6F4E]" />
          <p>
            Thanks — your report was submitted and will be reviewed by the
            university team.
          </p>
        </div>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-[#E3EAE2] bg-white shadow-[0_12px_36px_rgba(23,43,35,0.07)]">
        <div className="relative aspect-[16/8] min-h-64 bg-[#E8EEE6] sm:aspect-[16/7]">
          <Image
            src={normalizePublicImageUrl(restaurant.imageUrl)}
            alt={restaurant.name}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172B23]/80 via-[#172B23]/10 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                Restaurant profile
              </p>
              <h1 className="mt-2 font-display text-3xl leading-tight sm:text-5xl">
                {restaurant.name}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/75">
                <MapPin size={15} aria-hidden="true" />
                {restaurant.location}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-[#172B23]/55 px-3.5 py-2.5 text-white backdrop-blur-md">
              <Star size={16} className="fill-[#F4C95D] text-[#F4C95D]" aria-hidden="true" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-xs text-white/65">
                ({reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                restaurant.openNow
                  ? "bg-[#EAF3E9] text-[#2F6F4E]"
                  : "bg-[#F0F2EF] text-[#6E7971]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  restaurant.openNow ? "bg-[#2F6F4E]" : "bg-[#8B958D]"
                }`}
              />
              {restaurant.openNow ? "Open now" : "Closed"}
            </span>
            {restaurant.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-[#F2F5F1] px-3 py-1.5 text-xs font-medium text-[#66736A]"
              >
                {category}
              </span>
            ))}
          </div>
          {!isOfficer && (
            <Link
              href={`/reports/new?restaurant=${restaurant.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#203B2E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2F6F4E]"
            >
              Report an issue <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </section>

      {restaurant.hasActiveComplaint && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#F0D9C9] bg-[#FFF8F2] p-4 text-sm leading-6 text-[#8D5A36]">
          <ShieldAlert size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            There is an open student report for this restaurant. Its status
            below shows whether it is awaiting review or being investigated;
            an open report does not confirm a violation.
          </p>
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)]">
        <div>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2F6F4E]">
                Student feedback
              </p>
              <h2 className="mt-1 font-display text-3xl text-[#20342A]">
                Reviews
              </h2>
            </div>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#718078] shadow-sm ring-1 ring-[#E3EAE2]">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>

          {restaurantReviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#DCE5DC] bg-white px-5 py-10 text-center">
              <p className="font-display text-xl text-[#263B30]">
                No reviews yet
              </p>
              <p className="mt-1 text-sm text-[#718078]">
                Be the first to share your experience.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {restaurantReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-[#E3EAE2] bg-white p-4 shadow-[0_6px_24px_rgba(23,43,35,0.035)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-[#263B30]">
                      Student
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className="text-[#B78316]"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <span className="text-xs text-[#87928A]">
                        {review.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p lang="bn" className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#52635A]">
                    {review.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-[#E3EAE2] bg-white p-5 shadow-[0_6px_24px_rgba(23,43,35,0.045)] sm:p-6">
          <h3 className="font-display text-2xl text-[#20342A]">
            Share your experience
          </h3>
          <p className="mb-5 mt-1 text-sm leading-6 text-[#718078]">
            Your star rating contributes to this place’s live average. One
            review is allowed per student.
          </p>
          {isStudent ? (
            <ReviewForm restaurantId={restaurant.id} />
          ) : role === null ? (
            <Link
              href="/auth/signin"
              className="inline-flex rounded-xl bg-[#203B2E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2F6F4E]"
            >
              Sign in to review
            </Link>
          ) : (
            <p className="text-sm text-[#718078]">
              Student accounts can submit reviews.
            </p>
          )}
        </aside>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2F6F4E]">
              Community updates
            </p>
            <h2 className="mt-1 font-display text-3xl text-[#20342A]">
              Community reports
            </h2>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#718078] shadow-sm ring-1 ring-[#E3EAE2]">
            {restaurantReports.length}{" "}
            {restaurantReports.length === 1 ? "report" : "reports"}
          </span>
        </div>

        {restaurantReports.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#DCE5DC] bg-white px-5 py-10 text-center">
            <p className="font-display text-xl text-[#263B30]">
              No community reports yet
            </p>
            <p className="mt-1 text-sm text-[#718078]">
              Student reports for this restaurant will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {restaurantReports.map((report) => {
              const typeLabel =
                REPORT_TYPES.find((type) => type.value === report.type)?.label ??
                report.type;
              const status = REPORT_STATUSES[report.status];
              return (
                <article
                  key={report.id}
                  className="rounded-3xl border border-[#E3EAE2] bg-white p-5 shadow-[0_6px_24px_rgba(23,43,35,0.04)] sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-semibold text-[#263B30]">
                      {typeLabel}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_TONE_CLASSES[status.tone]}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#52635A]">
                    {report.description}
                  </p>
                  <p className="mt-4 flex items-center gap-1.5 border-t border-[#EDF0EC] pt-3 text-xs text-[#87928A]">
                    <CalendarDays size={13} aria-hidden="true" />
                    Submitted {report.createdAt.toLocaleDateString()}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}