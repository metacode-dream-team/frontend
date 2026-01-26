# Auth Service API Documentation

## Содержание

1. [Обзор](#обзор)
2. [Базовые настройки](#базовые-настройки)
3. [API Endpoints](#api-endpoints)
4. [Интеграция с Keycloak](#интеграция-с-keycloak)
5. [Социальная аутентификация (Google/GitHub)](#социальная-аутентификация-googlegithub)
6. [Email функциональность](#email-функциональность)
7. [Примеры использования](#примеры-использования)
8. [Обработка ошибок](#обработка-ошибок)
9. [Безопасность](#безопасность)

---

## Обзор

Auth Service — это микросервис аутентификации, который предоставляет REST API для регистрации пользователей, входа в систему, верификации email, восстановления пароля и управления токенами доступа.

### Основные возможности:

- ✅ Регистрация пользователей (email/password)
- ✅ Аутентификация через Keycloak (email/password)
- ✅ Верификация email адреса
- ✅ Восстановление пароля
- ✅ Обновление access/refresh токенов
- ✅ Отправка email уведомлений через SMTP
- ✅ Социальная аутентификация через Google/GitHub (напрямую через Keycloak)

### Технологический стек:

- **Backend**: Go 1.24+
- **Identity Provider**: Keycloak (OIDC/OAuth2)
- **Email**: SMTP (gomail)
- **Tokens**: JWT для временных токенов (верификация, сброс пароля)
- **HTTP**: Стандартный net/http с middleware
- **OAuth2 Flow**: Authorization Code + PKCE для социальной аутентификации

---

## Базовые настройки

### Base URL

```
http://localhost:8081
```

### CORS

Сервис настроен на работу с фронтендом через CORS. По умолчанию разрешены запросы с:
- `http://localhost:5173` (можно настроить через `FRONTEND_URL`)

### Content-Type

Все запросы должны отправляться с заголовком:
```
Content-Type: application/json
```

### Формат ответов

**Успешный ответ:**
```json
{
  "message": "Описание результата",
  "data": { ... }
}
```

**Ошибка:**
```json
{
  "error": "Описание ошибки"
}
```

---

## API Endpoints

### 1. Регистрация пользователя

**POST** `/v1/register`

Создает нового пользователя в Keycloak и отправляет email с ссылкой для верификации.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "confirm_password": "securePassword123"
}
```

#### Валидация

- `email`: обязательное поле, должен быть валидным email адресом
- `password`: обязательное поле, минимум 8 символов
- `confirm_password`: обязательное поле, должно совпадать с `password`

#### Response (200 OK)

```json
{
  "message": "User registered. Please verify your email."
}
```

#### Response (400 Bad Request)

```json
{
  "error": "Validation failed: Check email format or password match"
}
```

#### Response (500 Internal Server Error)

```json
{
  "error": "Registration failed"
}
```

#### Что происходит на бэкенде:

1. Получает admin token от Keycloak (client_credentials grant)
2. Создает пользователя в Keycloak с:
   - `username` = email
   - `email` = email
   - `enabled` = true
   - `emailVerified` = false
   - `requiredActions` = ["VERIFY_EMAIL"]
3. Генерирует JWT токен с `userID` и сроком действия (по умолчанию 5 минут)
4. Отправляет email с ссылкой вида: `{FRONTEND_URL}/verify-email?token={JWT_TOKEN}`

---

### 2. Вход в систему

**POST** `/v1/login`

Аутентифицирует пользователя через Keycloak и возвращает пару токенов (access + refresh).

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Валидация

- `email`: обязательное поле, валидный email
- `password`: обязательное поле

#### Response (200 OK)

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "expires_in": 300,
  "token_type": "Bearer"
}
```

#### Response (400 Bad Request)

```json
{
  "error": "Email and password are required"
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Invalid credentials"
}
```

#### Что происходит на бэкенде:

1. Использует Resource Owner Password Credentials grant в Keycloak
2. Отправляет запрос на `/realms/{realm}/protocol/openid-connect/token`
3. Keycloak возвращает токены (access_token, refresh_token, id_token)
4. Сервис возвращает токены клиенту

**Важно:** Access token от Keycloak содержит информацию о пользователе и имеет срок действия (обычно 5 минут). Refresh token используется для получения новых access токенов.

---

### 3. Верификация email

**POST** `/v1/verify-email?token={JWT_TOKEN}`

Подтверждает email адрес пользователя после регистрации.

#### Query Parameters

- `token` (required): JWT токен, полученный в email письме

#### Response (200 OK)

```json
{
  "message": "Email verified"
}
```

#### Response (400 Bad Request)

```json
{
  "error": "Token required"
}
```

или

```json
{
  "error": "Invalid or expired token"
}
```

#### Что происходит на бэкенде:

1. Парсит JWT токен и извлекает `userID`
2. Проверяет срок действия токена
3. Получает admin token от Keycloak
4. Обновляет пользователя в Keycloak:
   - `emailVerified` = true
   - `enabled` = true
   - `requiredActions` = [] (удаляет VERIFY_EMAIL)

**Важно:** Токен верификации действителен только 5 минут (настраивается через `JWT_EXPIRATION_MINUTES`).

---

### 4. Обновление токенов

**POST** `/v1/token/refresh`

Обменивает refresh token на новую пару access/refresh токенов.

#### Request Body

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ..."
}
```

#### Валидация

- `refresh_token`: обязательное поле

#### Response (200 OK)

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "expires_in": 300,
  "token_type": "Bearer"
}
```

#### Response (400 Bad Request)

```json
{
  "error": "Refresh token is required"
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Invalid refresh token"
}
```

#### Что происходит на бэкенде:

1. Отправляет refresh_token в Keycloak
2. Keycloak валидирует токен и возвращает новую пару токенов
3. Сервис возвращает новые токены клиенту

**Рекомендация:** Обновляйте токены автоматически перед истечением срока действия access token (например, за 1 минуту до истечения).

---

### 5. Запрос на восстановление пароля

**POST** `/v1/forgot-password`

Инициирует процесс восстановления пароля. Отправляет email с ссылкой для сброса пароля.

#### Request Body

```json
{
  "email": "user@example.com"
}
```

#### Валидация

- `email`: обязательное поле, валидный email

#### Response (200 OK)

```json
{
  "message": "If an account exists with that email, a reset link has been sent."
}
```

**Важно:** Сервис всегда возвращает успешный ответ, даже если пользователь не найден. Это предотвращает атаки на перечисление пользователей (user enumeration).

#### Что происходит на бэкенде:

1. Получает admin token от Keycloak
2. Ищет пользователя по email в Keycloak
3. Если пользователь найден:
   - Генерирует JWT токен с `userID` и `action: "password_reset"`
   - Срок действия токена: 15 минут
   - Отправляет email с ссылкой: `{FRONTEND_URL}/reset-password?token={JWT_TOKEN}`
4. Если пользователь не найден — просто возвращает успех (без отправки email)

---

### 6. Сброс пароля

**POST** `/v1/reset-password`

Устанавливает новый пароль пользователя по токену из email.

#### Request Body

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "new_password": "newSecurePassword123",
  "confirm_password": "newSecurePassword123"
}
```

#### Валидация

- `token`: обязательное поле
- `new_password`: обязательное поле, минимум 8 символов
- `confirm_password`: обязательное поле, должно совпадать с `new_password`

#### Response (200 OK)

```json
{
  "message": "Password has been updated successfully."
}
```

#### Response (400 Bad Request)

```json
{
  "error": "Validation failed: check token and password requirements"
}
```

или

```json
{
  "error": "Failed to reset password. The link may be expired."
}
```

#### Что происходит на бэкенде:

1. Парсит JWT токен и извлекает `userID`
2. Проверяет срок действия токена (15 минут)
3. Получает admin token от Keycloak
4. Обновляет пароль пользователя в Keycloak через Admin API

**Важно:** Токен сброса пароля действителен 15 минут.

---

## Интеграция с Keycloak

### Архитектура

Auth Service использует Keycloak как Identity Provider (IdP) для управления пользователями и выдачи токенов.

### Grant Types

#### 1. Client Credentials Grant
Используется для административных операций:
- Создание пользователей
- Верификация email
- Сброс пароля
- Поиск пользователей

**Endpoint:** `{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token`

```http
POST /realms/{realm}/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={CLIENT_ID}
&client_secret={CLIENT_SECRET}
```

#### 2. Resource Owner Password Credentials Grant
Используется для аутентификации пользователей при входе.

**Endpoint:** `{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token`

```http
POST /realms/{realm}/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id={CLIENT_ID}
&client_secret={CLIENT_SECRET}
&username={email}
&password={password}
&scope=openid
```

#### 3. Refresh Token Grant
Используется для обновления токенов.

**Endpoint:** `{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token`

```http
POST /realms/{realm}/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&client_id={CLIENT_ID}
&client_secret={CLIENT_SECRET}
&refresh_token={refresh_token}
```

### Структура пользователя в Keycloak

При регистрации пользователь создается со следующими полями:

```json
{
  "username": "user@example.com",
  "email": "user@example.com",
  "enabled": true,
  "emailVerified": false,
  "requiredActions": ["VERIFY_EMAIL"],
  "credentials": [
    {
      "type": "password",
      "value": "password",
      "temporary": false
    }
  ]
}
```

**Важно:** Email используется как `username` в Keycloak для упрощения логики.

### Admin API

Сервис использует Keycloak Admin REST API для управления пользователями:

- `POST /admin/realms/{realm}/users` — создание пользователя
- `GET /admin/realms/{realm}/users?email={email}&exact=true` — поиск по email
- `PUT /admin/realms/{realm}/users/{id}` — обновление пользователя
- `PUT /admin/realms/{realm}/users/{id}/reset-password` — сброс пароля

Все запросы требуют Bearer токен в заголовке `Authorization`.

---

## Социальная аутентификация (Google/GitHub)

### Обзор

Социальная аутентификация через Google и GitHub происходит **напрямую через Keycloak**, минуя Auth Service. Это означает, что фронтенд обращается к Keycloak напрямую, используя стандартный OAuth2 Authorization Code flow с PKCE (Proof Key for Code Exchange).

**Важно:** Auth Service не участвует в процессе социальной аутентификации. Он используется только для:
- Регистрации с email/password
- Входа с email/password
- Верификации email
- Восстановления пароля

### Архитектура

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │
       │ 1. Authorization Request (PKCE)
       ▼
┌─────────────┐
│  Keycloak   │◄──────┐
└──────┬──────┘       │
       │              │
       │ 2. Redirect │ 3. OAuth
       │    to IdP    │    Flow
       ▼              │
┌─────────────┐      │
│ Google/     │      │
│ GitHub      │──────┘
└─────────────┘
       │
       │ 4. Callback with code
       ▼
┌─────────────┐
│  Keycloak   │
└──────┬──────┘
       │
       │ 5. Exchange code for tokens
       ▼
┌─────────────┐
│  Frontend   │
└─────────────┘
```

### Настройка

Для работы социальной аутентификации необходимо:

1. **Настроить Identity Providers в Keycloak:**
   - Google OAuth2 Provider
   - GitHub OAuth2 Provider

2. **Настроить Client в Keycloak:**
   - Client ID: `frontend-app` (или другой, используемый на фронтенде)
   - Access Type: `public` (для PKCE)
   - Valid Redirect URIs: `http://localhost:5173/callback` (или ваш домен)
   - Standard Flow Enabled: `ON`
   - Direct Access Grants Enabled: `OFF` (опционально)

### Конфигурация на фронтенде

Создайте файл `src/keycloak.ts`:

```typescript
export const KEYCLOAK_URL = "http://localhost:8080";
export const REALM = "metacode";
export const CLIENT_ID = "frontend-app";
export const REDIRECT_URI = window.location.origin + "/callback";

// PKCE helpers
function generateRandomString(length: number) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) =>
    ("0" + (b % 36).toString(36)).slice(-1)
  ).join("");
}

async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

function base64UrlEncode(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// Login URL (login through IdP optional)
export async function getLoginUrl(provider?: string) {
  const codeVerifier = generateRandomString(64);
  localStorage.setItem("pkce_verifier", codeVerifier);

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashed);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "openid profile email",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  if (provider) params.append("kc_idp_hint", provider);

  return `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth?${params.toString()}`;
}

// Link GitHub to existing user (AIA - Account Information and Access)
export async function getLinkGithubUrl() {
  const codeVerifier = generateRandomString(64);
  localStorage.setItem("pkce_verifier", codeVerifier);

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashed);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "openid",
    kc_action: "idp_link",
    kc_idp_hint: "github",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth?${params.toString()}`;
}
```

### Использование

#### 1. Вход через Google

```typescript
import { getLoginUrl } from './keycloak';

async function loginWithGoogle() {
  const loginUrl = await getLoginUrl('google');
  window.location.href = loginUrl;
}
```

#### 2. Вход через GitHub

```typescript
import { getLoginUrl } from './keycloak';

async function loginWithGitHub() {
  const loginUrl = await getLoginUrl('github');
  window.location.href = loginUrl;
}
```

#### 3. Обработка callback

После успешной аутентификации Keycloak перенаправит пользователя на `/callback?code={authorization_code}&state={state}`.

Создайте компонент или страницу для обработки callback:

```typescript
// src/pages/Callback.tsx или Callback.vue
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      console.error('Authentication error:', error);
      navigate('/login?error=' + error);
      return;
    }

    if (code) {
      exchangeCodeForTokens(code)
        .then((tokens) => {
          // Сохраняем токены
          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('refresh_token', tokens.refresh_token);
          localStorage.setItem('id_token', tokens.id_token);
          localStorage.setItem('expires_in', tokens.expires_in.toString());
          
          // Перенаправляем на главную страницу
          navigate('/');
        })
        .catch((err) => {
          console.error('Token exchange failed:', err);
          navigate('/login?error=token_exchange_failed');
        });
    }
  }, [code, error, navigate]);

  return <div>Processing authentication...</div>;
}
```

#### 4. Обмен authorization code на токены

```typescript
import { KEYCLOAK_URL, REALM, CLIENT_ID, REDIRECT_URI } from './keycloak';

async function exchangeCodeForTokens(code: string) {
  const codeVerifier = localStorage.getItem('pkce_verifier');
  
  if (!codeVerifier) {
    throw new Error('Code verifier not found');
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const response = await fetch(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Token exchange failed');
  }

  const tokens = await response.json();
  
  // Удаляем code_verifier после использования
  localStorage.removeItem('pkce_verifier');
  
  return tokens;
}
```

#### 5. Привязка GitHub к существующему аккаунту (AIA)

Если пользователь уже залогинен через email/password и хочет привязать GitHub:

```typescript
import { getLinkGithubUrl } from './keycloak';

async function linkGitHubAccount() {
  // Пользователь должен быть уже аутентифицирован
  const accessToken = localStorage.getItem('access_token');
  
  if (!accessToken) {
    throw new Error('User must be logged in');
  }

  const linkUrl = await getLinkGithubUrl();
  window.location.href = linkUrl;
}
```

### Полный пример компонента входа

```typescript
import React from 'react';
import { getLoginUrl } from '../keycloak';

export function LoginPage() {
  const handleGoogleLogin = async () => {
    const url = await getLoginUrl('google');
    window.location.href = url;
  };

  const handleGitHubLogin = async () => {
    const url = await getLoginUrl('github');
    window.location.href = url;
  };

  const handleEmailLogin = async (email: string, password: string) => {
    // Используем Auth Service API
    const response = await fetch('http://localhost:8081/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const tokens = await response.json();
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      // ...
    }
  };

  return (
    <div>
      <h2>Login</h2>
      
      <button onClick={handleGoogleLogin}>
        Login with Google
      </button>
      
      <button onClick={handleGitHubLogin}>
        Login with GitHub
      </button>
      
      {/* Форма для email/password */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        handleEmailLogin(
          formData.get('email') as string,
          formData.get('password') as string
        );
      }}>
        <input name="email" type="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Login with Email</button>
      </form>
    </div>
  );
}
```

### Параметры запроса авторизации

При создании URL для авторизации используются следующие параметры:

| Параметр | Описание | Обязательный |
|----------|----------|---------------|
| `client_id` | ID клиента в Keycloak | Да |
| `response_type` | Должен быть `code` для Authorization Code flow | Да |
| `redirect_uri` | URI для перенаправления после аутентификации | Да |
| `scope` | Запрашиваемые разрешения (обычно `openid profile email`) | Да |
| `code_challenge` | Base64url-encoded SHA256 hash от code_verifier | Да (для PKCE) |
| `code_challenge_method` | Метод хеширования (должен быть `S256`) | Да (для PKCE) |
| `kc_idp_hint` | Подсказка для выбора Identity Provider (`google`, `github`) | Нет |
| `kc_action` | Действие (`idp_link` для привязки аккаунта) | Нет |

### Ответ от Keycloak

После успешной аутентификации Keycloak перенаправит на:

```
{REDIRECT_URI}?code={authorization_code}&state={state}
```

В случае ошибки:

```
{REDIRECT_URI}?error={error_code}&error_description={description}
```

### Обмен кода на токены

**Endpoint:** `{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token`

**Method:** POST

**Content-Type:** `application/x-www-form-urlencoded`

**Body:**
```
grant_type=authorization_code
&code={authorization_code}
&redirect_uri={REDIRECT_URI}
&client_id={CLIENT_ID}
&code_verifier={code_verifier}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "token_type": "Bearer",
  "scope": "openid profile email"
}
```

### Безопасность PKCE

PKCE (Proof Key for Code Exchange) используется для защиты Authorization Code flow в публичных клиентах (SPA):

1. **Code Verifier**: Случайная строка 43-128 символов, генерируется клиентом
2. **Code Challenge**: SHA256 hash от Code Verifier, кодированный в base64url
3. **Code Challenge Method**: `S256` (SHA256)

**Зачем это нужно:**
- Защита от перехвата authorization code
- Предотвращение атак с подменой кода
- Рекомендуется OAuth2 для публичных клиентов

### Привязка социальных аккаунтов (AIA)

Keycloak поддерживает Account Information and Access (AIA) для привязки социальных аккаунтов к существующему пользователю:

1. Пользователь должен быть уже аутентифицирован
2. Используется параметр `kc_action=idp_link`
3. После привязки пользователь может входить через любой из привязанных провайдеров

### Обработка ошибок

```typescript
async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');

  if (error) {
    switch (error) {
      case 'access_denied':
        // Пользователь отменил авторизацию
        console.error('User cancelled authentication');
        break;
      case 'invalid_request':
        // Неверный запрос
        console.error('Invalid request:', errorDescription);
        break;
      case 'invalid_client':
        // Неверный client_id
        console.error('Invalid client configuration');
        break;
      default:
        console.error('Authentication error:', error, errorDescription);
    }
    // Перенаправляем на страницу входа
    window.location.href = '/login?error=' + error;
    return;
  }

  // Продолжаем обмен кода на токены
  const code = urlParams.get('code');
  if (code) {
    await exchangeCodeForTokens(code);
  }
}
```

### Отличия от Auth Service API

| Аспект | Auth Service API | Социальная аутентификация |
|--------|------------------|---------------------------|
| **Endpoint** | `http://localhost:8081/v1/*` | `http://localhost:8080/realms/*` |
| **Flow** | Resource Owner Password Credentials | Authorization Code + PKCE |
| **Провайдеры** | Email/Password | Google, GitHub, и другие IdP |
| **Токены** | Через Auth Service | Напрямую от Keycloak |
| **Использование** | Программный вход | Редирект на провайдера |

### Рекомендации

1. **Всегда используйте PKCE** для публичных клиентов (SPA)
2. **Храните code_verifier** в localStorage только на время flow
3. **Удаляйте code_verifier** после успешного обмена кода на токены
4. **Обрабатывайте ошибки** от Keycloak и провайдеров
5. **Валидируйте токены** перед использованием (можно декодировать JWT)
6. **Используйте HTTPS** в production

---

## Email функциональность

### SMTP конфигурация

Сервис использует SMTP для отправки email уведомлений. Настройки задаются через переменные окружения:

- `SMTP_HOST` — адрес SMTP сервера
- `SMTP_PORT` — порт SMTP сервера
- `SMTP_USER` — имя пользователя для аутентификации
- `SMTP_PASS` — пароль для аутентификации
- `EMAIL_FROM` — адрес отправителя

### Типы email

#### 1. Email верификации

**Метод:** `SendVerificationEmail(to, link)`

**Формат:** Plain text

**Содержимое:**
```
{link}
```

**Пример ссылки:**
```
http://localhost:5173/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...
```

#### 2. Email сброса пароля

**Метод:** `SendPasswordResetEmail(to, link)`

**Формат:** HTML

**Содержимое:**
```html
Click <a href='{link}'>here</a> to reset your password.
```

**Пример ссылки:**
```
http://localhost:5173/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ...
```

### JWT токены для email

Сервис генерирует собственные JWT токены для временных операций (верификация, сброс пароля). Эти токены:

- Подписываются секретом из `JWT_SECRET`
- Содержат `userID` в claims
- Имеют срок действия (5 минут для верификации, 15 минут для сброса пароля)
- Используют алгоритм HS256

**Важно:** Эти токены НЕ являются access/refresh токенами от Keycloak. Они используются только для одноразовых операций через email.

---

## Примеры использования

### JavaScript/TypeScript

#### 1. Регистрация

```typescript
async function register(email: string, password: string, confirmPassword: string) {
  const response = await fetch('http://localhost:8081/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      confirm_password: confirmPassword,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  const data = await response.json();
  return data;
}
```

#### 2. Вход

```typescript
async function login(email: string, password: string) {
  const response = await fetch('http://localhost:8081/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  
  // Сохраняем токены
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('id_token', data.id_token);
  localStorage.setItem('expires_in', data.expires_in.toString());
  
  return data;
}
```

#### 3. Верификация email

```typescript
async function verifyEmail(token: string) {
  const response = await fetch(`http://localhost:8081/v1/verify-email?token=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Verification failed');
  }

  const data = await response.json();
  return data;
}

// Использование в компоненте (например, React)
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    verifyEmail(token)
      .then(() => {
        alert('Email verified successfully!');
        // Перенаправление на страницу входа
      })
      .catch((error) => {
        alert(`Verification failed: ${error.message}`);
      });
  }
}, []);
```

#### 4. Обновление токенов

```typescript
async function refreshToken(refreshToken: string) {
  const response = await fetch('http://localhost:8081/v1/token/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Token refresh failed');
  }

  const data = await response.json();
  
  // Обновляем токены
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('id_token', data.id_token);
  localStorage.setItem('expires_in', data.expires_in.toString());
  
  return data;
}

// Автоматическое обновление токенов
function setupTokenRefresh() {
  const expiresIn = parseInt(localStorage.getItem('expires_in') || '300');
  const refreshTime = (expiresIn - 60) * 1000; // Обновляем за 1 минуту до истечения
  
  setTimeout(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await refreshToken(refreshToken);
        setupTokenRefresh(); // Настраиваем следующий refresh
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Перенаправление на страницу входа
      }
    }
  }, refreshTime);
}
```

#### 5. Запрос на восстановление пароля

```typescript
async function forgotPassword(email: string) {
  const response = await fetch('http://localhost:8081/v1/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  const data = await response.json();
  return data;
}
```

#### 6. Сброс пароля

```typescript
async function resetPassword(token: string, newPassword: string, confirmPassword: string) {
  const response = await fetch('http://localhost:8081/v1/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Password reset failed');
  }

  const data = await response.json();
  return data;
}

// Использование в компоненте
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // Показываем форму для ввода нового пароля
    setResetToken(token);
  }
}, []);
```

#### 7. Использование access token для защищенных запросов

```typescript
async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem('access_token');
  
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  // Если токен истек, пытаемся обновить
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await refreshToken(refreshToken);
        // Повторяем запрос с новым токеном
        return makeAuthenticatedRequest(url, options);
      } catch (error) {
        // Перенаправление на страницу входа
        window.location.href = '/login';
        throw error;
      }
    }
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}
```

### React Hook пример

```typescript
import { useState, useEffect } from 'react';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
      setupTokenRefresh();
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await login(email, password);
    setAccessToken(data.access_token);
    setIsAuthenticated(true);
    setupTokenRefresh();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_in');
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    accessToken,
    login,
    logout,
  };
}
```

---

## Обработка ошибок

### HTTP статус коды

| Код | Описание | Когда возникает |
|-----|----------|-----------------|
| 200 | OK | Успешный запрос |
| 400 | Bad Request | Невалидные данные, отсутствуют обязательные поля |
| 401 | Unauthorized | Неверные учетные данные, истекший/невалидный токен |
| 405 | Method Not Allowed | Использован неправильный HTTP метод |
| 500 | Internal Server Error | Ошибка на сервере |

### Типичные ошибки

#### 1. Валидация

```json
{
  "error": "Validation failed: Check email format or password match"
}
```

**Причины:**
- Неверный формат email
- Пароль менее 8 символов
- Пароли не совпадают
- Отсутствуют обязательные поля

#### 2. Аутентификация

```json
{
  "error": "Invalid credentials"
}
```

**Причины:**
- Неверный email или пароль
- Пользователь не существует
- Аккаунт отключен

#### 3. Токены

```json
{
  "error": "Invalid or expired token"
}
```

**Причины:**
- Токен истек (верификация: 5 минут, сброс пароля: 15 минут)
- Невалидная подпись токена
- Токен уже использован

```json
{
  "error": "Invalid refresh token"
}
```

**Причины:**
- Refresh token истек
- Токен был отозван
- Неверный формат токена

### Рекомендации по обработке

```typescript
async function handleApiCall<T>(
  apiCall: () => Promise<Response>
): Promise<T> {
  try {
    const response = await apiCall();
    
    if (!response.ok) {
      const error = await response.json();
      
      // Обработка специфичных ошибок
      if (response.status === 401) {
        // Попытка обновить токен или перенаправление на логин
        handleUnauthorized();
        throw new Error(error.error);
      }
      
      if (response.status === 400) {
        // Показываем пользователю детали валидации
        throw new ValidationError(error.error);
      }
      
      throw new Error(error.error || 'Request failed');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ValidationError) {
      // Показываем пользователю ошибки валидации
      showValidationErrors(error.message);
    } else {
      // Логируем и показываем общую ошибку
      console.error('API Error:', error);
      showErrorMessage('Something went wrong. Please try again.');
    }
    throw error;
  }
}
```

---

## Безопасность

### Рекомендации для фронтенда

#### 1. Хранение токенов

**✅ Хорошо:**
- Хранить токены в `localStorage` или `sessionStorage` (для SPA)
- Использовать httpOnly cookies (если возможно, через настройку CORS с credentials)

**❌ Плохо:**
- Хранить токены в обычных cookies без httpOnly
- Хранить токены в глобальных переменных
- Логировать токены в консоль

#### 2. Передача токенов

Всегда используйте заголовок `Authorization`:

```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

#### 3. HTTPS

В production всегда используйте HTTPS для защиты токенов при передаче.

#### 4. CORS

Сервис настроен на работу с определенным фронтендом через CORS. Убедитесь, что `FRONTEND_URL` в конфигурации соответствует вашему домену.

#### 5. Валидация на клиенте

Хотя сервер валидирует все данные, рекомендуется также валидировать на клиенте для лучшего UX:

```typescript
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 8;
}
```

#### 6. Защита от CSRF

Для дополнительной защиты используйте CSRF токены в критичных операциях (сброс пароля, изменение email).

#### 7. Rate Limiting

Учитывайте, что сервер может иметь rate limiting. Обрабатывайте ошибки 429 (Too Many Requests):

```typescript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  showErrorMessage(`Too many requests. Please try again after ${retryAfter} seconds.`);
}
```

### Best Practices

1. **Автоматическое обновление токенов**: Настройте автоматическое обновление access token перед истечением срока действия.

2. **Обработка истекших токенов**: При получении 401 ошибки автоматически пытайтесь обновить токен. Если обновление не удалось — перенаправляйте на страницу входа.

3. **Логирование**: Не логируйте токены или пароли в консоль или отправляйте их в аналитику.

4. **Очистка при выходе**: При выходе из системы удаляйте все токены из хранилища.

5. **Проверка токенов**: Периодически проверяйте валидность токенов перед критичными операциями.

---

## Дополнительная информация

### Переменные окружения

Для настройки сервиса используются следующие переменные:

```env
# Application
ENVIRONMENT=dev.default
PORT=8081
FRONTEND_URL=http://localhost:5173
LOGLEVEL=info

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=metacode
KEYCLOAK_CLIENT_ID=auth_service_client
KEYCLOAK_CLIENT_SECRET=changeme

# Email (SMTP)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=noreply@example.com
SMTP_PASS=changeme
EMAIL_FROM=noreply@example.com

# JWT (для временных токенов)
JWT_SECRET=changeme
JWT_EXPIRATION_MINUTES=5
```

### Время жизни токенов

- **Access Token (Keycloak)**: Обычно 5 минут (настраивается в Keycloak)
- **Refresh Token (Keycloak)**: Зависит от настроек Keycloak (обычно несколько часов/дней)
- **Email Verification Token (JWT)**: 5 минут (настраивается через `JWT_EXPIRATION_MINUTES`)
- **Password Reset Token (JWT)**: 15 минут (захардкожено в коде)

### Логирование

Сервис использует logrus для логирования. Уровень логирования настраивается через `LOGLEVEL` (debug, info, warn, error).

---

## Поддержка

При возникновении проблем:

1. Проверьте логи сервиса
2. Убедитесь, что Keycloak доступен и правильно настроен
3. Проверьте настройки SMTP для отправки email
4. Убедитесь, что CORS настроен правильно
5. Проверьте валидность токенов (можно декодировать JWT на jwt.io)

---

**Версия документации:** 1.0  
**Дата обновления:** 2026-01-26
