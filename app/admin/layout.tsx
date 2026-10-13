import type { ReactNode } from "react";
import { AdminNavigation } from "@/components/admin-navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] md:flex">
      <AdminNavigation />
      <div className="min-w-0 flex-1 bg-[#F4F6F1]">{children}</div>
    </div>
  );
}
