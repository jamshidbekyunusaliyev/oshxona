import Link from "next/link";
import { ArrowLeft, WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="grid min-h-[70svh] place-items-center px-5 py-16 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-primary/30 text-primary">
          <WifiOff className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Aloqa yo&apos;q</p>
        <h1 className="mt-3 font-heading text-4xl">Dasturxon kutib turadi.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">Internetga ulaning va retseptlarni yana ko&apos;ring. Saqlangan sahifalar qurilmangizda ochilishi mumkin.</p>
        <Link href="/" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" /> Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  );
}