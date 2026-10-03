export default function RecipesLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-[1480px] px-5 pb-24 pt-14 sm:px-9 md:px-14">
      <div className="h-3 w-44 animate-pulse rounded bg-muted" />
      <div className="mt-5 h-14 max-w-[620px] animate-pulse rounded bg-muted" />
      <div className="mt-10 h-12 animate-pulse border-b border-border bg-muted/30" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[4/3] rounded-md bg-muted" />
            <div className="mt-4 h-5 w-3/4 rounded bg-muted" />
            <div className="mt-3 h-3 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}