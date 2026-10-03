import Link from "next/link";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  return (
    <main className="grid min-h-[60svh] place-items-center px-5 py-16 text-center">
      <div className="max-w-sm">
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-primary/30 text-primary"><Heart className="size-6" aria-hidden="true" /></span>
        <h1 className="mt-6 font-heading text-4xl">Sevimli retseptlar</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Yoqtirgan taomlaringizni saqlab, shu yerda topasiz.</p>
        <Link href="/recipes" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Retseptlarni ko&apos;rish</Link>
      </div>
    </main>
  );
}