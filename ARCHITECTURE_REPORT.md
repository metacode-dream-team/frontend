# 2 БАҒДАРЛАМАЛЫҚ ҚҰРАЛ БӨЛІГІН ӘЗІРЛЕУ ЖӘНЕ METACODE ҚЫЗМЕТІН ТЕХНИКАЛЫҚ ІСКЕ АСЫРУ

## 2.1 MetaCode фронтенд архитектурасын жобалау

### Технологиялық стек және таңдау себептері

MetaCode платформасының пайдаланушы интерфейсі заманауи веб-технологиялар мен модульдік архитектуралық әдіснамаларға негізделген. Технологиялық стекті таңдауда өнімділік, қолдауға қолайлылық және қауіпсіздік негізгі критерийлер болды.

**TypeScript 5** – барлық код TypeScript тілінде жазылған. Статикалық типтеу қателерді әзірлеу кезеңінде анықтауға мүмкіндік береді, IDE автодополнение мен навигацияны жақсартады. shared/types/api.ts және entities/*/model/types.ts файлдары API контракттары мен домендік модельдерді анықтайды. tsconfig.json-дағы "strict": true режимі код сенімділігін арттырады. JavaScript орнына TypeScript таңдалуына себеп – көлемді жобаларда рефакторинг пен қолдауды жеңілдету (Microsoft, 2024).

**React 19.2.3** – UI құрастыру үшін компоненттік модель қолданылады. useState, useEffect, useMemo сияқты хуқтар күй мен побочдық әсерлерді басқаруды жеңілдетеді. React 19 Concurrent Mode, Actions және жақсартылған Suspense мүмкіндіктерін қамтамасыз етеді. React Server Components (RSC) Next.js арқылы серверлік және клиенттік рендерингті бөлуге мүмкіндік береді.

**Next.js 16.1.4** – App Router файл негізіндегі маршрутизацияны қамтамасыз етеді (app/dashboard/page.tsx → /dashboard). Серверлік компоненттер әдепкі бойынша қолданылады – бұл клиентке жіберілетін JavaScript көлемін азайтады. «use client» директивасы тек хуқтар, оқиғалар немесе браузер API қажет болғанда қолданылады. Code splitting, prefetching және кескіндерді оңтайландыру автоматты түрде жүзеге асырылады.

**Zustand 5.0.10** – глобалды күйді басқару үшін. Redux пен MobX-пен салыстырғанда Zustand минималды API-ға ие (~1 КБ), провайдерлер мен қосымша бойлерплейтсіз. Селекторлар арқылы тек қажетті store бөліктеріне жазылу өнімділікті арттырады. TypeScript-пен жақсы интеграцияланады, Concurrent Mode-мен үйлесімді.

**Tailwind CSS 4** – стильдер utility-first тәсілін қолданады: әрбір CSS класы бір функцияны орындайды (мысалы, bg-black, px-4, rounded-lg). Бұл құрылымдық консистенттілікті, респонсивтілікті (sm:, md:, xl: breakpoint-тері) және қараңғы теманы (dark: префиксі) қамтамасыз етеді. Tree-shaking тек қолданылатын кластарды бандлға енгізеді. PostCSS (@tailwindcss/postcss) арқылы қосылады.

**Шрифттер** – Geist Sans және Geist Mono next/font/google арқылы жүктеледі. display: "swap" мәтінді тез көрсетуді қамтамасыз етеді. CSS айнымалылары (--font-geist-sans, --font-geist-mono) globals.css-те орнатылады. :root және @theme inline Tailwind 4-пен интеграцияланады, prefers-color-scheme: dark арқылы жүйелік қараңғы тема қолдау көрсетіледі.

**Biome 2.2.0** – ESLint пен Prettier орнына бір құрал. Rust тілінде жазылған Biome линтинг пен форматтауды біріктіріп, айтарлықтай жылдамдық береді. "lint": "biome check", "format": "biome format --write" скрипттері package.json-да.

**React Compiler (babel-plugin-react-compiler 1.0.0)** – next.config.ts-та reactCompiler: true. Компиляция кезеңінде useMemo және useCallback қызметін автоматты орындайды, қолмен оптимизация қажеттілігін азайтады.

### Архитектура: Feature-Sliced Design (FSD)

Feature-Sliced Design әдіснамасы күрделі фронтенд жүйесін логикалық қабаттарға бөлуге мүмкіндік береді (Feature-Sliced Design, 2024). Импорт бағыты тек төмен қарай: shared ← entities ← features ← widgets ← app. Бұл масштабталуды, қайта пайдалануды және тестілеуді жеңілдетеді.

### Сетелік қатынас және қауіпсіздік

Платформаның сетелік қатынасы арнайы әзірленген ApiClient класы арқылы жүзеге асырылады. Бұл клиент access token-ді автоматты түрде жаңартады (401 жауабы кезінде refresh token арқылы), credentials: "include" параметрі арқылы httpOnly cookie-де сақталған refresh token-ді браузер автоматты түрде жібереді. Бұл тәсіл XSS шабуылдарынан қорғанысты арттырады (OWASP, 2023). Keycloak OAuth2 интеграциясы үшін PKCE протоколы қолданылады – client_secret қажетсіз қауіпсіз авторизация. keycloak-js орнына арнайы жеңіл шешім – бандл өлшемін азайтады.

AuthProvider қолданба жүктелген сәтте initializeAuth() шақырады, refresh token арқылы access token алады. Бэкенд қолжетімсіз болса – дамыту режимінде қатесіз инициализацияланады. Access token мерзімі аяқталғанға дейін 1 минут қалғанда автоматты жаңарту таймеры іске қосылады.

Сурет 1. MetaCode фронтенд құрылымы (FSD қабаттары)

```
src/
├── app/        # Инициализация, роутинг, провайдерлер
├── widgets/    # Жиналмалы UI блоктары (DashboardGrid, LeaderboardTable)
├── features/   # Пайдаланушы әрекеттері (login, toggle-favorite)
├── entities/   # Бизнес-сущностьтер (auth, roadmap, profile)
└── shared/     # Қайта пайдаланылатын код (UI, lib, config)
```

Ескерту: Авторлар жасаған жұмыс

---

## 2.2 Фронтенд архитектурасын іске асыру (FSD, SOLID)

MetaCode платформасының фронтенд бөлімі Feature-Sliced Design (FSD) әдіснамасы мен SOLID принциптеріне негізделген. Жобаның ішкі құрылымы кодтың логикалық қабаттарға қатаң бөлінгенін көрсетеді. Бұл архитектуралық тәсілдің негізгі мақсаты – бизнес-логиканы сыртқы факторлардан (UI фреймворктар, API клиенттер, стильдер) оқшаулау (Martin, 2017). Импорт бағыты тек төмен қарай жүреді: features қабаты entities және shared-тан тәуелді, бірақ widgets-тан тәуелді емес. Бұл Dependency Inversion принципіне сәйкес келеді – жоғары қабат төмен қабаттың ішкі құрылымынан хабарсыз.

Сурет 2. entities/auth модулінің құрылымы

```
entities/auth/
├── api/           # authApi – API әдістері
├── model/         # authStore (Zustand), types, useAuth
└── index.ts       # Public API: export { useAuthStore, authApi }
```

Ескерту: Авторлар жасаған жұмыс

entities қабаты жүйенің «өзегі» болып табылады. Мұнда auth, roadmap, profile, leaderboard, dashboard, stats, feed, event сияқты домендік модельдер мен олардың API интерфейстері жинақталған. Әрбір entity index.ts арқылы public API ұсынады – бұл инкапсуляцияны қамтамасыз етеді және ішкі құрылымның өзгеруі features пен widgets қабаттарына әсер етпейді. Мысалы, entities/auth модулі useAuthStore, authApi және типтерді экспорттайды; features/auth/login тек осы интерфейс арқылы жұмыс істейді.

Сурет 3. features/auth/login модулінің құрылымы

```
features/auth/login/
├── api/           # login.ts – loginUser функциясы
├── model/         # useLogin.ts – логикалық хук
└── ui/            # LoginForm.tsx – форма компоненті
```

Ескерту: Авторлар жасаған жұмыс

features қабаты пайдаланушы әрекеттерін инкапсуляциялайды. useLogin хукі useState, useRouter және useAuthStore-ды біріктіріп, login функциясын, isLoading және error күйін қайтарады. LoginForm компоненті тек осы хукті қолданады – бұл Single Responsibility принципіне сәйкес келеді: UI компоненті тек көрсетуді, ал хук бизнес-логиканы орындайды. Валидация validateLoginForm утилитасы арқылы shared қабатында орналасқан, бұл қайта пайдалануды қамтамасыз етеді.

widgets қабаты features пен entities-ті біріктіретін жиналмалы блоктарды қамтиды. DashboardGrid виджеті getGithubStats, getLeetcodeStats, getMonkeytypeStats сияқты dashboardApi әдістерін шақырады, useEditDashboard фичасын қолданады және StatsWidget, ActivityHeatmap сияқты басқа виджеттерді құрайды. Бұл құрылым күрделі UI блоктарын қайта пайдалануға және тестілеуге қолайлы етеді.

shared қабаты барлық қабаттар үшін ортақ инфрақұрылымды қамтиды. shared/ui – Button (forwardRef, variant: primary/secondary/outline, size: sm/md/lg, isLoading), Input (label, type, validation), Avatar (size, fallback), MarkdownText, Skeleton. shared/lib/api – ApiClient (get, post, put, delete, refreshAccessToken) және mock API: roadmapApi, profileApi, dashboardApi, feedApi, leaderboardApi. Mock API-лар фронтенд пен бэкенд параллель дамығанда қолданылады; delay() арқылы желі кідірісі имитацияланады; болашақта apiClient арқылы нақты API-ға ауыстыруға дайын. shared/lib/keycloak – PKCE генерациясы, getLoginUrl, getLinkGithubUrl. shared/lib/utils – cn() (className біріктіру), validateLoginForm, jwt утилиталары. shared/config – API_BASE_URL, KEYCLOAK_URL, KEYCLOAK_REALM, REDIRECT_URI. shared/types – AuthTokens, LoginRequest, ApiError сияқты API типтері. Бұл құрылым DRY принципіне сәйкес келеді.

### Стиль коды және UI компоненттері

Стильдер Tailwind utility-first тәсілін қолданады. Button компонентінде variantStyles және sizeStyles объектілері кластарды топтастырады: primary – "bg-black text-white dark:bg-white dark:text-black", outline – "border-2 border-gray-300 hover:bg-gray-50". cn() утилитасы (shared/lib/utils/cn.ts) className мәндерін біріктіреді. Компоненттер className және ...props арқылы кеңейтіледі, accessibility (focus, disabled) қамтамасыз етіледі.

### Features және Widgets тізімі

Features: auth (login, register, forgot-password, reset-password, verify-email, social-login), edit-dashboard (useEditDashboard – drag-and-drop, layout), fetch-feed, filter-activity-calendar, leaderboard (fetch-leaderboard, infinite-scroll), roadmap-search, toggle-favorite, toggle-monkeytype-mode, track-progress, upvote-roadmap. Widgets: activity-heatmap, current-user-banner, dashboard-grid, global-feed, leaderboard-table, profile-page, roadmap-canvas, roadmap-catalog, roadmap-details-page, roadmap-editor, stats-widget, top-players.

### Маршрутизация және конфигурация

Next.js App Router: app/dashboard/page.tsx → /dashboard, app/profile/[id]/page.tsx → /profile/:id, app/roadmaps/[id], app/(auth)/login, /register, /callback, /verify-email, /forgot-password, /reset-password. «use client» директивасы тек клиенттік JavaScript қажет болғанда. TypeScript paths: @/* → ./src/*.

### Технологиялық стек қорытындысы

| Категория | Құрал | Неге таңдалған |
|-----------|-------|----------------|
| Тіл | TypeScript 5 | Типтеу, контракттар, рефакторинг |
| Фреймворк | Next.js 16.1.4 | App Router, RSC, оптимизация |
| UI | React 19.2.3 | Компоненттер, хуқтар, экожүйе |
| Архитектура | FSD | Масштабталу, қабаттар изоляциясы |
| Күй | Zustand 5.0.10 | Жеңілдік, өнімділік, кішкене өлшем |
| Стильдер | Tailwind CSS 4 | Utility-first, tree-shaking, респонсивтілік |
| Линтинг | Biome 2.2.0 | Жылдамдық, бір құрал |
| Оптимизация | React Compiler | Автоматты мемоизация |
| API | Fetch + ApiClient | Refresh, cookie, типтеу |
| OAuth | Keycloak + PKCE | Қауіпсіздік, keycloak-js қажетсіз |

Қорыта айтқанда, MetaCode фронтенд архитектурасы масштабталуға және қолдауға бағытталған. FSD қабаттары жаңа фичаларды еш қиындықсыз қосуға мүмкіндік береді. Zustand-тың жеңілдігі күрделі Redux конфигурациясын қажет етпейді. Tailwind CSS utility-first тәсілі дизайн жүйесінің консистенттілігін қамтамасыз етеді. Осылайша, Feature-Sliced Design мен SOLID принциптерін қолдану MetaCode платформасын болашақта функционалдық жағынан кеңейтуге толық мүмкіндік береді.
