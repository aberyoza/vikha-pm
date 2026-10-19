import { ButtonLink, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Eyebrow>Помилка 404</Eyebrow>
      <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight">
        Сторінку не знайдено
      </h1>
      <p className="mt-3 text-lg text-muted">
        Можливо, цей модуль ще не опублікований.
      </p>
      <ButtonLink href="/#program" variant="secondary" className="mt-8">
        До програми курсу
      </ButtonLink>
    </main>
  );
}
