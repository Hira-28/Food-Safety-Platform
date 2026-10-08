export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/reports/new", "/reports/mine", "/admin/:path*"],
};