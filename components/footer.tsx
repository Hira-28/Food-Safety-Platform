export function Footer() {
  return (
    <footer className="border-t border-[#1C2B24]/10 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-[#1C2B24]/60">
        <div>
          <p className="font-display text-base text-[#1C2B24] mb-1">
            Campus Eats
          </p>
          <p>Helping students eat safely, together.</p>
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <p>Reports are reviewed by the university proctorial team.</p>
          <p>&copy; {new Date().getFullYear()} Campus Eats.</p>
        </div>
      </div>
    </footer>
  );
}