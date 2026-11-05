# Сервіси проєкту

Довідник: який сервіс за що відповідає, що в ньому налаштовано і де це змінити. Стан на 2026-11-05.

**Репозиторій публічний, тому секретів тут немає й не може бути.** Ключі зберігаються лише в тих сервісах, де вони працюють. Покрокове налаштування з нуля описано в [auth-setup.md](auth-setup.md).

## Коротко

| Сервіс | За що відповідає | Де відкрити |
|---|---|---|
| GitHub | код, PR | [aberyoza/vikha-pm](https://github.com/aberyoza/vikha-pm) |
| Vercel | хостинг сайту, деплой, змінні середовища, Firewall, аналітика | [vercel.com/dashboard](https://vercel.com/dashboard) |
| Cloudflare | DNS домену `vikha-pm.com` | [dash.cloudflare.com](https://dash.cloudflare.com/) |
| Supabase | база, вхід, шаблони листів | [проєкт Vikha](https://supabase.com/dashboard/project/fxoxmlmhabecscdpemsv) |
| Google Cloud | кнопка «Увійти через Google» | [Google Auth Platform](https://console.cloud.google.com/auth/overview) |
| Resend | надсилання листів | [resend.com/domains](https://resend.com/domains) |

## Де що лежить із секретів

| Секрет | Де зберігається | Як замінити |
|---|---|---|
| Google Client secret | Supabase → Sign In / Providers → Google | Google Auth Platform → Clients → `Vikha web` → Add secret, вставити в Supabase, старий вимкнути й видалити |
| Ключ Resend | Supabase → Emails → SMTP Settings, поле Password | Resend → API Keys → створити новий, вставити в Supabase, старий видалити |

Обидва значення показують лише раз, тому після втрати їх не відновлюють, а замінюють. Не надсилайте їх у чат і не робіть скриншотів цих вікон.

## GitHub

- Автор пушить і зливає PR сам.
- Гілка `main` автоматично деплоїться на vikha-pm.com через Vercel.

## Vercel

- **Домен:** `vikha-pm.com`.
- **`NEXT_PUBLIC_SUPABASE_URL` і `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`:** публічні значення Supabase.
- **`NEXT_PUBLIC_AUTH_ENABLED`:** на сайті вимкнено. Перевірка 2026-11-05: кнопки «Увійти» немає, `/login`, `/welcome`, `/cabinet` і `/auth/callback` дають 404. Значення вбудовується під час збирання, тому після зміни потрібен новий деплой.
- **Firewall і правила для ботів:** налаштовуються в панелі Vercel. Правило WAF лежить у `vercel.json`, а блокування за країнами також є в `src/proxy.ts`.

## Cloudflare

Усі нові записи стоять у режимі **DNS only**.

| Тип | Ім'я | Значення | Навіщо |
|---|---|---|---|
| TXT | `resend._domainkey` | довгий ключ `p=MIGfMA...` | підпис листів DKIM |
| CNAME | `send` | `send.forge.rmta.net` | SPF і повернення листів через Resend |
| CNAME | `rsend` | `rsend-euw1.forge.rmta.net` | службовий запис Resend |
| TXT | `@` | `v=spf1 -all` | основний домен сам листів не надсилає. **Не змінювати** |
| TXT | `_dmarc` | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s` | захист від підробки. **Не змінювати** |

Записи `v=spf1 -all` і DMARC менять не довелося: тестовий лист пройшов SPF, DKIM і DMARC.

## Supabase

Проєкт `fxoxmlmhabecscdpemsv`, регіон Франкфурт, безкоштовний тариф. Міграції лежать у `supabase/migrations/`.

| Розділ | Налаштування |
|---|---|
| [Sign In / Providers](https://supabase.com/dashboard/project/fxoxmlmhabecscdpemsv/auth/providers) | Google увімкнено, Email увімкнено, строк дії посилання `3600` секунд |
| [URL Configuration](https://supabase.com/dashboard/project/fxoxmlmhabecscdpemsv/auth/url-configuration) | Site URL `https://vikha-pm.com`. Redirect URLs: `https://vikha-pm.com/auth/callback**` і `http://localhost:3100/auth/callback**` |
| [SMTP Settings](https://supabase.com/dashboard/project/fxoxmlmhabecscdpemsv/auth/smtp) | хост `smtp.resend.com`, порт `465`, користувач `resend`, відправник `no-reply@vikha-pm.com`, ім'я «Віха» |
| Emails → Templates | українські шаблони **Magic Link** і **Confirm signup**, тема «Вхід до курсу «Віха»» |
| Rate Limits | `100` листів на годину |

## Google Cloud

- **Проєкт:** `Vikha`. Перевіряйте, що він вибраний у верхній панелі консолі.
- **OAuth-клієнт:** `Vikha web`, тип Web application.
- **Authorized redirect URI:** `https://fxoxmlmhabecscdpemsv.supabase.co/auth/v1/callback`.
- **Audience:** External, статус **Testing**. Входити можуть лише додані в Test users. Тому для всіх людей вхід через Google поки не працює.
- **Billing:** не потрібен, пропозицію Free Trial активувати не треба.

## Resend

- **Домен:** `vikha-pm.com`, статус Verified, регіон Ireland (eu-west-1).
- **Прийом листів:** вимкнено, трекінг вимкнено.
- **API-ключ:** один, для Supabase SMTP, з правом лише надсилати.
- **Ліміти:** безкоштовний тариф, орієнтовно 100 листів на день. Перевірте актуальний ліміт у Resend перед просуванням курсу.

## Локальна розробка

`.env.local` не потрапляє в git. У ньому на комп'ютері автора ввімкнено `NEXT_PUBLIC_AUTH_ENABLED=1`, і локальний сайт працює з **бойовою** базою Supabase. Профілі, створені локально, справжні.

## Що перевірено

- Вхід через Google на `localhost:3100` акаунтом тестового користувача.
- Вхід через email: лист від Resend, перехід за посиланням, SPF, DKIM і DMARC зі статусом PASS.

## Що ще не зроблено або не перевірено

- [ ] Переконатися, що старий Google Client secret, який потрапив на скриншот, вимкнено й видалено.
- [ ] Перевірити `https://vikha-pm.com` в Authorized JavaScript origins клієнта Google.
- [ ] Отримати український лист: шаблони збережено, але лист після цього ще не надсилали.
- [ ] Опублікувати сторінку `/privacy`.
- [ ] Заповнити Branding у Google Auth Platform і натиснути **Publish app**: для цього потрібна `/privacy`.
- [ ] Увімкнути `NEXT_PUBLIC_AUTH_ENABLED=1` у Vercel лише після `/privacy` і збереження прогресу.
- [ ] Перевірити вхід на реальному сайті vikha-pm.com, а не лише локально.
- [ ] Перевірити лист, відкритий на іншому пристрої, ніж той, де запросили вхід.
