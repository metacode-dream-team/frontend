# Metacode Frontend

Frontend приложение на Next.js с архитектурой Feature-Sliced Design (FSD) и системой авторизации.

## Технологии

- **Next.js 16** - React фреймворк
- **TypeScript** - Типизация
- **Zustand** - State management
- **Tailwind CSS** - Стилизация
- **Feature-Sliced Design** - Архитектура проекта

## Архитектура

Проект использует методологию **Feature-Sliced Design (FSD)** для организации кода. Подробные правила и руководство находятся в файле [FSD_RULES.md](./FSD_RULES.md).

### Структура слоев

```
src/
├── app/              # Инициализация приложения, роутинг
│   ├── (auth)/       # Route group для страниц авторизации
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── callback/
│   └── page.tsx      # Главная страница
├── pages/            # Композиция страниц (если используется)
├── widgets/          # Крупные блоки интерфейса
├── features/         # Бизнес-действия пользователя
├── entities/         # Бизнес-сущности (store, модели)
└── shared/           # Переиспользуемый код (UI, утилиты, API)
```

### Route Groups

Используем **route groups** `(auth)` для организации страниц авторизации:
- Не влияют на URL (`/login` остается `/login`)
- Изолируют логически связанные страницы
- Упрощают масштабирование при добавлении новых сервисов

## Авторизация

### Токены

- **Access Token**: Хранится в Zustand store (в памяти, без persist)
- **Refresh Token**: Хранится в httpOnly cookie (управляется бэкендом)

### Реализованные фичи

- ✅ Регистрация пользователя
- ✅ Вход в систему (email/password)
- ✅ Верификация email
- ✅ Восстановление пароля
- ✅ Сброс пароля
- ✅ Социальная авторизация (Google/GitHub через Keycloak)
- ✅ Автоматическое обновление токенов

### API Документация

Подробная документация API находится в файле [FRONTEND_API_DOCUMENTATION.md](./FRONTEND_API_DOCUMENTATION.md).

## Настройка

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` на основе `.env.example`:

```bash
cp .env.example .env.local
```

Заполните переменные:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8081

# Keycloak Configuration
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=metacode
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=frontend-app
```

### 3. Запуск dev сервера

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Доступные страницы

- `/` - Главная страница
- `/login` - Вход в систему
- `/register` - Регистрация
- `/verify-email` - Верификация email (с токеном в query)
- `/forgot-password` - Запрос на восстановление пароля
- `/reset-password` - Сброс пароля (с токеном в query)
- `/callback` - OAuth callback от Keycloak

## Команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск production сервера
npm start

# Линтинг
npm run lint

# Форматирование
npm run format
```

## Правила разработки

1. **Соблюдайте FSD архитектуру** - смотрите [FSD_RULES.md](./FSD_RULES.md)
2. **Используйте TypeScript** - избегайте `any`
3. **Следуйте принципам чистого кода**
4. **Тестируйте изменения** перед коммитом

## Структура проекта

### Shared слой

- `shared/ui/` - Переиспользуемые UI компоненты
- `shared/lib/api/` - API клиент
- `shared/lib/utils/` - Утилиты
- `shared/lib/keycloak/` - Keycloak OAuth2 клиент
- `shared/config/` - Конфигурация
- `shared/types/` - Общие типы

### Entities

- `entities/auth/` - Сущность авторизации (Zustand store, API)

### Features

- `features/auth/login/` - Вход в систему
- `features/auth/register/` - Регистрация
- `features/auth/verify-email/` - Верификация email
- `features/auth/forgot-password/` - Восстановление пароля
- `features/auth/reset-password/` - Сброс пароля
- `features/auth/social-login/` - Социальная авторизация

## Дополнительная информация

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
