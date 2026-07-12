export default function SaasMockup() {

  return (
    <div className="relative ml-auto mt-20 w-full max-w-3xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/85 shadow-2xl shadow-emerald-950/10 backdrop-blur-md lg:-mt-10">
      <div className="flex h-14 items-center gap-2 border-b px-5">
        <span className="h-3 w-3 rounded-full bg-zinc-200" />
        <span className="h-3 w-3 rounded-full bg-zinc-200" />
        <span className="h-3 w-3 rounded-full bg-zinc-200" />
      </div>

      <div className="grid min-h-105 grid-cols-[220px_1fr]">
        <aside className="border-r bg-zinc-50/70 p-5">
          <div className="mb-8 h-8 w-28 rounded-md bg-zinc-200" />

          <div className="space-y-3">
            <div className="h-10 rounded-lg bg-emerald-100" />
            <div className="h-10 rounded-lg bg-zinc-100" />
            <div className="h-10 rounded-lg bg-zinc-100" />
            <div className="h-10 rounded-lg bg-zinc-100" />
          </div>
        </aside>

        <div className="p-8">
          <div className="mb-8 h-9 w-56 rounded-md bg-zinc-200" />

          <div className="grid gap-5 md:grid-cols-3">
            <div className="h-32 rounded-xl border bg-white shadow-sm" />
            <div className="h-32 rounded-xl border bg-white shadow-sm" />
            <div className="h-32 rounded-xl border bg-white shadow-sm" />
          </div>

          <div className="mt-5 h-48 rounded-xl border bg-zinc-50" />
        </div>
      </div>
    </div>
  )
}
