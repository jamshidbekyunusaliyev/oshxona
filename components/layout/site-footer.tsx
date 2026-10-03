import Link from "next/link";
import { InstallButton } from "@/components/ui/install-button";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card px-5 py-9 sm:px-9 md:px-14">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="font-heading text-2xl">Tasty</Link>
          <p className="mt-1 text-xs text-muted-foreground">Yaxshi taomlar, birga yaxshiroq.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-muted-foreground">
          <Link href="/recipes" className="min-h-11 content-center hover:text-primary">Retseptlar</Link>
          <Link href="/favorites" className="min-h-11 content-center hover:text-primary">Sevimlilar</Link>
          <InstallButton />
        </nav>
      </div>
    </footer>
  );
}