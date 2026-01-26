# Feature-Sliced Design (FSD) - Правила и руководство

## Обзор архитектуры

Проект использует методологию **Feature-Sliced Design (FSD)** для организации кода. FSD разделяет код на слои и слайсы для обеспечения масштабируемости и поддерживаемости.

## Структура слоев

```
src/
├── app/              # Инициализация приложения, провайдеры, роутинг
│   ├── (auth)/       # Route group для страниц авторизации (не влияет на URL)
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── callback/
│   └── page.tsx      # Главная страница
├── pages/            # Композиция страниц из виджетов и фич (если используется)
├── widgets/          # Крупные самостоятельные блоки интерфейса
├── features/         # Бизнес-действия пользователя
├── entities/         # Бизнес-сущности (модели данных, store)
└── shared/           # Переиспользуемый код (UI, утилиты, API)
```

### Route Groups в Next.js

Используем **route groups** `(auth)` для организации страниц авторизации:
- Не влияют на URL структуру (`/login` остается `/login`)
- Помогают изолировать логически связанные страницы
- Упрощают масштабирование при добавлении новых сервисов

## Правила импорта

### ✅ Разрешенные импорты (сверху вниз):

1. **app** → может импортировать из всех слоев
2. **pages** → может импортировать из `widgets`, `features`, `entities`, `shared`
3. **widgets** → может импортировать из `features`, `entities`, `shared`
4. **features** → может импортировать из `entities`, `shared`
5. **entities** → может импортировать только из `shared`
6. **shared** → не может импортировать из других слоев

### ❌ Запрещенные импорты:

- Импорт из верхних слоев в нижние (например, `entities` → `features`)
- Импорт между слайсами одного слоя (используйте `shared` для общих частей)
- Циклические зависимости

## Описание слоев

### `app/`
- Инициализация приложения
- Провайдеры (Zustand, React Query, и т.д.)
- Глобальные стили
- Роутинг (Next.js App Router)
- Route groups `(auth)`, `(dashboard)` и т.д. для организации страниц

**Пример:**
```typescript
// app/providers.tsx
export function Providers({ children }: { children: React.ReactNode }) {
  return <ZustandProvider>{children}</ZustandProvider>;
}
```

### `pages/`
- Композиция страниц
- Использует виджеты и фичи
- Не содержит бизнес-логику

**Пример:**
```typescript
// pages/login/index.tsx
export default function LoginPage() {
  return (
    <div>
      <LoginForm />
      <SocialAuthButtons />
    </div>
  );
}
```

### `widgets/`
- Крупные самостоятельные блоки интерфейса
- Композиция из фич и сущностей
- Примеры: Header, Sidebar, ProductCard

**Пример:**
```typescript
// widgets/header/index.tsx
export function Header() {
  const { user } = useAuth();
  return (
    <header>
      <Logo />
      <Navigation />
      <UserMenu user={user} />
    </header>
  );
}
```

### `features/`
- Бизнес-действия пользователя
- Примеры: login, register, add-to-cart, toggle-theme
- Каждая фича изолирована и может быть удалена без влияния на другие

**Структура фичи:**
```
features/
  login/
    ui/
      LoginForm.tsx
    api/
      login.ts
    model/
      useLogin.ts
    index.ts
```

**Пример:**
```typescript
// features/login/ui/LoginForm.tsx
export function LoginForm() {
  const { login } = useLogin();
  // ...
}
```

### `entities/`
- Бизнес-сущности
- Модели данных, store (Zustand), типы
- Примеры: user, product, auth

**Структура сущности:**
```
entities/
  auth/
    model/
      authStore.ts
      types.ts
    api/
      authApi.ts
    index.ts
```

**Пример:**
```typescript
// entities/auth/model/authStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
}));
```

### `shared/`
- Переиспользуемый код
- UI компоненты (Button, Input, Modal)
- Утилиты (formatDate, validateEmail)
- API клиент, конфигурация
- Типы и константы

**Структура:**
```
shared/
  ui/
    Button/
    Input/
    Modal/
  lib/
    api/
      client.ts
    utils/
      formatDate.ts
  config/
    constants.ts
  types/
    common.ts
```

## Принципы чистого кода

### 1. Именование
- Компоненты: PascalCase (`LoginForm.tsx`)
- Функции/переменные: camelCase (`handleSubmit`)
- Константы: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Типы/интерфейсы: PascalCase (`User`, `AuthResponse`)

### 2. Файловая структура
- Один компонент/функция = один файл
- Индексные файлы (`index.ts`) для экспорта публичного API
- Группировка по назначению (ui/, api/, model/)

### 3. Типизация
- Всегда используйте TypeScript
- Избегайте `any`, используйте `unknown` при необходимости
- Экспортируйте типы из `types.ts` или `model/types.ts`

### 4. Разделение ответственности
- UI компоненты только отображают данные
- Бизнес-логика в `model/` или `api/`
- Хуки для переиспользуемой логики

### 5. Обработка ошибок
- Используйте try/catch для асинхронных операций
- Централизованная обработка ошибок API в `shared/lib/api/`
- Показывайте понятные сообщения пользователю

## Работа с API

### Структура API клиента

```typescript
// shared/lib/api/client.ts
const apiClient = {
  get: (url: string) => fetch(url),
  post: (url: string, data: unknown) => fetch(url, { method: 'POST', body: JSON.stringify(data) }),
};
```

### Использование в фичах

```typescript
// features/login/api/login.ts
import { apiClient } from '@/shared/lib/api/client';

export async function loginUser(email: string, password: string) {
  return apiClient.post('/v1/login', { email, password });
}
```

## Работа с Zustand

### Хранение состояния

- **Access Token**: В Zustand store (в памяти, без persist)
- **Refresh Token**: В httpOnly cookie (управляется бэкендом)

### Структура store

```typescript
// entities/auth/model/authStore.ts
interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}
```

## Примеры правильной организации

### ✅ Правильно:

```typescript
// features/login/ui/LoginForm.tsx
import { useLogin } from '../model/useLogin';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export function LoginForm() {
  const { login, isLoading } = useLogin();
  // ...
}
```

### ❌ Неправильно:

```typescript
// features/login/ui/LoginForm.tsx
import { useAuthStore } from '@/entities/auth'; // ✅ OK
import { Header } from '@/widgets/header'; // ❌ НЕЛЬЗЯ! widgets выше features
import { LoginPage } from '@/pages/login'; // ❌ НЕЛЬЗЯ! pages выше features
```

## Чеклист для новых фич

- [ ] Создана папка в соответствующем слое
- [ ] Разделение на ui/, api/, model/ (если нужно)
- [ ] Экспорт через index.ts
- [ ] Типизация всех функций и компонентов
- [ ] Обработка ошибок
- [ ] Соответствие правилам импорта
- [ ] Компоненты переиспользуемы (если в shared/ui)

## Дополнительные правила

1. **Не используйте localStorage для access token** - только Zustand (в памяти)
2. **Refresh token** автоматически отправляется в httpOnly cookie браузером
3. **Автоматический refresh** токенов перед истечением (за 1 минуту)
4. **Обработка 401** - автоматический refresh, при неудаче - logout
5. **Валидация на клиенте** для лучшего UX (дополнительно к серверной)

## Полезные ссылки

- [Feature-Sliced Design](https://feature-sliced.design/)
- [FSD Methodology](https://feature-sliced.design/docs/get-started/overview)
