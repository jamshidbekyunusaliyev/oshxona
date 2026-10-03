import Link from "next/link";
import { UserRound } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="grid min-h-[60svh] place-items-center px-5 py-16 text-center">
      <div className="max-w-sm">
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-primary/30 text-primary"><UserRound className="size-6" aria-hidden="true" /></span>
        <h1 className="mt-6 font-heading text-4xl">Sizning profilingiz</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Retsept yaratish va sinxronlash uchun akkaunt sozlamalari shu yerda bo&apos;ladi.</p>
        <Link href="/recipes" className="mt-6 inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm hover:border-primary hover:text-primary">Retseptlarga qaytish</Link>
      </div>
    </main>
  );
}