import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Сторінку не знайдено
      </h1>
      <p className="mt-3 text-muted">
        Можливо, цей модуль ще не опублікований.
      </p>
      <Link href="/" className="mt-6 inline-block font-medium text-accent">
        На головну
      </Link>
    </main>
  );
}
