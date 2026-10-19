import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-24 sm:px-8">
      <p className="text-muted">Помилка 404</p>
      <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">
        Сторінку не знайдено
      </h1>
      <p className="mt-4 text-lg text-muted">
        Можливо, цей модуль ще готується. Подивіться, що вже відкрито.
      </p>
      <ButtonLink href="/#program" className="mt-8">
        Відкрити програму
      </ButtonLink>
    </main>
  );
}
