# Сервіси проєкту

Довідник: який сервіс за що відповідає, що в ньому налаштовано і де це змінити. Стан на 2026-11-05: вхід і збереження прогресу працюють на vikha-pm.com.

**Репозиторій публічний, тому секретів тут немає й не може бути.** Ключі зберігаються лише в тих сервісах, де вони працюють. Повний шлях налаштування описано в кінці файлу.

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
| Ключ Resend для входу | Supabase → Emails → SMTP Settings, поле Password | Resend → API Keys → створити новий, вставити в Supabase, старий видалити |
| Ключ Resend для листів про фідбек, `RESEND_API_KEY` | Vercel → Environment Variables, тип Secret, лише Production | Resend → API Keys → створити новий, замінити у Vercel, зробити Redeploy, старий видалити |

Обидва значення показують лише раз, тому після втрати їх не відновлюють, а замінюють. Не надсилайте їх у чат і не робіть скриншотів цих вікон.

## GitHub

- Автор пушить і зливає PR сам.
- Гілка `main` автоматично деплоїться на vikha-pm.com через Vercel.

## Vercel

- **Домен:** `vikha-pm.com`.
- **`NEXT_PUBLIC_SUPABASE_URL` і `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`:** публічні значення Supabase.
- **`NEXT_PUBLIC_AUTH_ENABLED`:** `1`, тип Config, лише Production, увімкнено 2026-11-05. Значення вбудовується під час збирання, тому після зміни потрібен новий деплой.
- **`RESEND_API_KEY`:** ключ для листів про фідбек. Без нього сайт працює, але листи про запити й відповіді не надсилаються.
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

Міграції в бойовій базі запускаються вручну: **SQL Editor → New query**, вставити вміст файлу, **Run**. Виконано міграції до `20261105180000_passport_feedback.sql`. Міграцію `20261105210000_feedback_limits.sql` з денним лімітом запитів треба виконати разом зі злиттям гілки `fix/admin-security`.

**Адміністратор:** `is_admin = true` у таблиці `profiles`. Змінити це поле можна лише через SQL Editor, із сайту воно недоступне.

## Захист адмінки

- `/admin` перевіряється на сервері в `src/proxy.ts`: сесію підтверджує Supabase, а всім, крім адміністратора, сторінка віддає 404.
- Правила доступу в базі працюють незалежно від сайту: дані видає лише RLS.
- API фідбеку приймає запити лише зі свого сайту й перевіряє права перед дією.
- Не більше 3 запитів на фідбек за добу від людини. Скасований запит рахується, але паспорта в ньому не лишається.
- Вхід адміністратора настільки надійний, наскільки надійний його Google-акаунт і пошта. На обох має бути двоетапна перевірка.

**Бекапів на безкоштовному тарифі немає.** Перед просуванням курсу треба повернутися до автоматичного експорту бази.

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
- **Audience:** External, статус **In production**.
- **Branding:** назва «Віха», домашня сторінка `https://vikha-pm.com`, політика `https://vikha-pm.com/privacy`, домен `vikha-pm.com`, контакт `vikha.course@gmail.com`. Логотипа немає: з ним Google може вимагати окрему перевірку.
- **Billing:** не потрібен, пропозицію Free Trial активувати не треба.

## Resend

- **Домен:** `vikha-pm.com`, статус Verified, регіон Ireland (eu-west-1).
- **Прийом листів:** вимкнено, трекінг вимкнено.
- **API-ключі:** окремий для Supabase SMTP (`Supabase Vikha`) і окремий для листів про фідбек на сайті. Обидва з правом лише надсилати.
- **Ліміти:** безкоштовний тариф, орієнтовно 100 листів на день. Перевірте актуальний ліміт у Resend перед просуванням курсу.

## Локальна розробка

`.env.local` не потрапляє в git. У ньому на комп'ютері автора ввімкнено `NEXT_PUBLIC_AUTH_ENABLED=1`, і локальний сайт працює з **бойовою** базою Supabase. Профілі, створені локально, справжні.

## Що перевірено

- Вхід через Google і збереження паспорта на vikha-pm.com, перевірив автор 2026-11-05.
- Старий Google Client secret видалено, `https://vikha-pm.com` є в Authorized JavaScript origins.
- Вхід через email: лист від Resend, перехід за посиланням, SPF, DKIM і DMARC зі статусом PASS.
- `/privacy` працює на vikha-pm.com, контактна адреса записана в `CONTACT_EMAIL` у `src/content/site.ts`.
- Функція видалення акаунта є в бойовій базі, гість викликати її не може. Саме видалення перевірено лише на локальній базі.

## Що ще не зроблено або не перевірено

- [ ] Виконати міграцію `20261105210000_feedback_limits.sql` у бойовій базі.
- [ ] Увімкнути двоетапну перевірку на Google-акаунті адміністратора і на `vikha.course@gmail.com`.
- [ ] Переглянути Supabase → Advisors → Security.
- [ ] Перевірити перший запит на фідбек на реальному сайті, реальні листи й вимкнення листів.
- [ ] Повернути картку про фідбек на головну сторінку.
- [ ] Налаштувати автоматичний експорт бази перед просуванням курсу.
- [ ] Отримати український лист: шаблони збережено, але лист після цього ще не надсилали.
- [ ] Показати текст політики юристу. На сторінці поки немає імені відповідальної особи, лише «автор курсу» і контактна пошта.
- [ ] Перевірити лист, відкритий на іншому пристрої, ніж той, де запросили вхід.

## Весь шлях налаштування

Кроки йдуть у тому порядку, у якому їх пройдено 2026-11-05. За ними сервіси можна налаштувати з нуля.

### 1. Google Cloud: проєкт

1. Відкрити [створення проєкту](https://console.cloud.google.com/projectcreate). Кнопка в інтерфейсі схована в перемикачі проєктів у верхній панелі.
2. Назва `Vikha`, Location «No organization», **Create**.
3. **Try for free** і **Start free** не натискати: це кредити, для входу вони не потрібні.

### 2. Google Cloud: екран згоди

1. Відкрити [Google Auth Platform](https://console.cloud.google.com/auth/overview) → **Get started**.
2. App name `Віха`, пошта підтримки, Audience **External**, контактна пошта, згода з правилами, **Create**.

### 3. Google Cloud: OAuth-клієнт

1. **Clients** → **Create client**, тип **Web application**, назва `Vikha web`.
2. **Authorized JavaScript origins:** `https://vikha-pm.com`.
3. **Authorized redirect URIs:** `https://fxoxmlmhabecscdpemsv.supabase.co/auth/v1/callback`.
4. **Create** і одразу скопіювати Client ID та Client secret. Секрет показують лише раз.

Два камені, на які ми наступили:

- Секрет потрапив на скриншот. Такий секрет треба замінити: **Add secret**, потім старий вимкнути й видалити.
- Помилка `Error 400: redirect_uri_mismatch` означала, що поле redirect URI порожнє. Після збереження адреси зміна застосовується від 5 хвилин до кількох годин.

### 4. Supabase: Google

1. Відкрити [Sign In / Providers](https://supabase.com/dashboard/project/fxoxmlmhabecscdpemsv/auth/providers) → **Google**.
2. Увімкнути провайдера, вставити Client ID і Client secret, **Save**.

### 5. Supabase: адреси повернення

1. Відкрити [URL Configuration](https://supabase.com/dashboard/project/fxoxmlmhabecscdpemsv/auth/url-configuration).
2. Site URL `https://vikha-pm.com`.
3. Redirect URLs, двома окремими записами: `https://vikha-pm.com/auth/callback**` і `http://localhost:3100/auth/callback**`.

### 6. Google Cloud: тестовий користувач

**Publish app** неактивна, доки на сторінці Branding немає посилання на політику конфіденційності. Тому поки: [Audience](https://console.cloud.google.com/auth/audience) → **Test users** → **Add users**.

### 7. Локальна перевірка входу через Google

1. Додати `NEXT_PUBLIC_AUTH_ENABLED=1` у `.env.local` і перезапустити сайт.
2. Відкрити `http://localhost:3100`, адреса має бути саме з `localhost`.
3. **Увійти** → **Увійти через Google** → заповнити профіль. У шапці з'являється «Акаунт».

### 8. Resend: домен

1. [Domains](https://resend.com/domains) → **Add domain**, `vikha-pm.com`, регіон Ireland (eu-west-1). Трекінг лишити вимкненим.
2. Вибрати **Manual setup**. Auto configure дав би Resend доступ до DNS у Cloudflare, а на цьому домені працює весь сайт.

### 9. Cloudflare: записи

У DNS → Records додати три записи з таблиці розділу «Cloudflare». Значення копіювати кнопкою в Resend, бо на екрані вони скорочені. Для CNAME вручну поставити **DNS only**.

### 10. Resend: підтвердження і ключ

1. Натиснути перевірку записів і дочекатися статусу **Verified**.
2. **API Keys** → **Create API key**, назва `Supabase Vikha`, **Sending access**, домен `vikha-pm.com`. Ключ показують лише раз.

### 11. Supabase: SMTP

Відкрити [SMTP Settings](https://supabase.com/dashboard/project/fxoxmlmhabecscdpemsv/auth/smtp), увімкнути **Enable Custom SMTP**, заповнити значеннями з розділу «Supabase», у Password вставити ключ Resend, **Save changes**.

### 12. Перевірка листа

1. На `localhost:3100` вийти з акаунта, запросити посилання на пошту Gmail, перейти за ним.
2. У Gmail: **⋮** → **Показати оригінал**. SPF, DKIM і DMARC мають показувати PASS.

### 13. Supabase: шаблони листів

**Authentication → Emails → Templates**, шаблони **Magic Link** і **Confirm signup**.

Тема: `Вхід до курсу «Віха»`

```html
<p>Натисніть на посилання, щоб увійти до курсу «Віха»:</p>
<p><a href="{{ .ConfirmationURL }}">Увійти</a></p>
<p>Посилання одноразове і діє одну годину. Якщо ви не запитували вхід, просто видаліть цей лист.</p>
```

### 14. Supabase: обмеження

- **Sign In / Providers → Email:** Email OTP Expiration `3600`.
- **Rate Limits:** Rate limit for sending emails `100` на годину.

### 15. Політика і публікація в Google

1. Злити PR із `/privacy` і перевірити сторінку на сайті.
2. Виконати міграцію видалення акаунта в SQL Editor.
3. [Branding](https://console.cloud.google.com/auth/branding): заповнити значеннями з розділу «Google Cloud», **Save**.
4. [Audience](https://console.cloud.google.com/auth/audience): **Publish app**, підтвердити. Статус стає In production.

### 16. Коли вмикати вхід на сайті

Спершу злити збереження прогресу й виконати його міграцію. Потім додати `NEXT_PUBLIC_AUTH_ENABLED=1` у Vercel і зробити новий деплой: значення вбудовується під час збирання.

### Локальна перевірка без бойового проєкту

Потрібен Docker. Вхід через email можна перевірити повністю, листи видно в Mailpit. Вхід через Google локально не працює без окремого OAuth-клієнта.

```bash
npx supabase start -x studio,storage-api,imgproxy,realtime,edge-runtime,logflare,vector,postgres-meta,supavisor
```

Потрібні значення покаже `npx supabase status`. Їх задають у змінних середовища разом із `NEXT_PUBLIC_AUTH_ENABLED=1`. На цей час у `next.config.ts` дозволено лише `http://127.0.0.1:54321`.
