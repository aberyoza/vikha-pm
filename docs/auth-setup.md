# Налаштування входу

Код входу готовий, але на сайті прихований, доки не ввімкнути `NEXT_PUBLIC_AUTH_ENABLED=1`. Ці кроки робить автор у своїх акаунтах. Ключі й паролі вводяться лише в ці сервіси: у репозиторій і в чат вони не потрапляють.

## 1. Google

1. У [Google Cloud Console](https://console.cloud.google.com/) створіть проєкт «Віха».
2. Налаштуйте екран згоди OAuth: тип External, назва застосунку «Віха», ваша пошта для підтримки, домен `vikha-pm.com`.
3. Створіть OAuth client ID типу Web application.
4. В Authorized redirect URIs додайте `https://fxoxmlmhabecscdpemsv.supabase.co/auth/v1/callback`.
5. Переведіть застосунок у статус In production, інакше ввійти зможуть лише додані вручну тестові користувачі.
6. У Supabase відкрийте Authentication → Sign In / Providers → Google, увімкніть провайдера і вставте Client ID та Client secret.

## 2. Пошта через Resend

Вбудована пошта Supabase має дуже малий ліміт і не підходить для реальних людей.

1. У [Resend](https://resend.com/) додайте домен `vikha-pm.com`.
2. Додайте в Cloudflare записи, які покаже Resend, у режимі DNS only.
3. Зараз на домені стоять SPF `v=spf1 -all` і DMARC `p=reject`. Звірте їх із вимогами Resend і змініть те, на що він вказує. Не видаляйте DMARC без потреби: він захищає домен від підробки.
4. Створіть API-ключ із правом лише надсилати листи.
5. Надішліть собі тестовий лист на Gmail і в «Показати оригінал» перевірте, що SPF, DKIM і DMARC мають статус PASS.

## 3. Supabase

**Authentication → URL Configuration**

- Site URL: `https://vikha-pm.com`
- Redirect URLs: `https://vikha-pm.com/auth/callback**` і `http://localhost:3100/auth/callback**`

**Project Settings → Authentication → SMTP**

- Host: `smtp.resend.com`, порт `465`, користувач `resend`, пароль: API-ключ із Resend
- Відправник: `no-reply@vikha-pm.com`, ім'я «Віха»

**Authentication → Sign In / Providers → Email**

- Email OTP Expiration: `3600` секунд (посилання діє годину)
- Email OTP Rate limit: `60` секунд між листами

**Authentication → Rate Limits:** підніміть ліміт листів на годину під очікувану кількість людей.

**Authentication → Email Templates:** замініть англійські листи на українські в шаблонах Magic Link і Confirm signup.

Тема: `Вхід до курсу «Віха»`

```html
<p>Натисніть на посилання, щоб увійти до курсу «Віха»:</p>
<p><a href="{{ .ConfirmationURL }}">Увійти</a></p>
<p>Посилання одноразове і діє одну годину. Якщо ви не запитували вхід, просто видаліть цей лист.</p>
```

## 4. Перевірка

Локально додайте `NEXT_PUBLIC_AUTH_ENABLED=1` у `.env.local`, запустіть сайт і пройдіть обидва входи: через Google і через email. Перевірте лист на телефоні й на ноутбуці.

## 5. Коли вмикати на сайті

Змінну `NEXT_PUBLIC_AUTH_ENABLED=1` додають у Vercel лише після двох умов:

- опубліковано сторінку `/privacy`, на яку посилається форма профілю;
- працює збереження прогресу, інакше вхід людям нічого не дає.

Після зміни змінної потрібен новий деплой, бо її значення вбудовується під час збирання.

## Локальна перевірка без бойового проєкту

Потрібен Docker. Вхід через email можна перевірити повністю, а листи видно у вбудованій поштовій скриньці Mailpit. Вхід через Google локально не працює без окремого OAuth-клієнта.

```bash
npx supabase start -x studio,storage-api,imgproxy,realtime,edge-runtime,logflare,vector,postgres-meta,supavisor
```

Потрібні значення покаже команда `npx supabase status`. Їх задають у змінних середовища разом із `NEXT_PUBLIC_AUTH_ENABLED=1`.
