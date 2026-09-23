export type CaseHighlight = {
  title: string;
  text: string;
};

export type CaseStat = {
  value: string;
  label: string;
};

export type CaseStudy = {
  subtitle: string;
  platform: string;
  team: string;
  projectType: string;
  duration: string;
  stackNote: string;
  client: string;
  task: string;
  highlights: CaseHighlight[];
  solution: string[];
  stats: CaseStat[];
  resultNote: string;
  productType: string;
};

const templateStats: CaseStat[] = [
  { value: "000+", label: "метрика результата" },
  { value: "0 мес", label: "срок до запуска" },
];

export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  year: string;
  tags: string[];
  mark?: string;
  cover?: string;
  caseStudy: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "novakids",
    title: "NovaKids",
    shortDescription:
      "Мобильное приложение для детей 7–10 лет, которое в игровой форме формирует привычку заботиться о здоровье, а родителям даёт прозрачный контроль прогресса.",
    description:
      "Мобильный продукт для детей: игровые механики, безопасный UX и computer vision-сценарии. Кроссплатформенная разработка на Flutter с REST API.",
    category: "Mobile Apps",
    year: "2025",
    tags: [
      "Flutter",
      "Dart",
      "REST API",
      "Computer Vision",
      "BLoC",
      "SQLite",
      "iOS",
      "Android",
    ],
    mark: "N",
    caseStudy: {
      subtitle:
        "Мобильный продукт для детей: игровые механики, безопасный UX и computer vision",
      platform: "iOS / Android",
      team: "0 специалистов",
      projectType: "Mobile Apps",
      duration: "0 месяцев",
      stackNote:
        "Flutter даёт единую кодовую базу для iOS и Android, BLoC держит состояние, SQLite хранит данные на устройстве, а Computer Vision закрывает AI-сценарии.",
      client:
        "Аудитория — дети 7–10 лет и их родители.\n\nПродукт в игровой форме помогает заботиться о здоровье и показывает прогресс.",
      task:
        "Собрать кроссплатформенное приложение на Flutter с REST API.\n\nВнутри — игровые механики, безопасный UX и computer vision-сценарии.",
      highlights: [
        {
          title: "Игровая привычка",
          text: "Приложение в игровой форме формирует привычку заботиться о здоровье.",
        },
        {
          title: "Контроль для родителей",
          text: "Родители видят прогресс ребёнка в прозрачном интерфейсе.",
        },
        {
          title: "Computer Vision",
          text: "В продукте есть сценарии компьютерного зрения на устройстве.",
        },
        {
          title: "Flutter и REST API",
          text: "Одна кодовая база для iOS и Android и обмен данными через REST API.",
        },
      ],
      solution: [
        "Мобильное приложение на Flutter для iOS и Android",
        "Интеграция с REST API",
        "Состояние на BLoC и локальные данные в SQLite",
        "Computer vision-сценарии внутри клиентского приложения",
      ],
      stats: templateStats,
      resultNote:
        "Дети получают игровой формат заботы о здоровье, а родители — прозрачный контроль прогресса.",
      productType: "мобильного приложения",
    },
  },
  {
    slug: "ai-beauty-advisor",
    title: "AI Beauty Advisor",
    shortDescription:
      "Онлайн-сервис, который анализирует состояние кожи по селфи и анкете, определяет индивидуальные потребности пользователя и рекомендует подходящие средства с возможностью покупки в один клик.",
    description:
      "Веб-сервис с CV-анализом кожи, персональными рекомендациями и продуктовой аналитикой. Frontend на React/TypeScript.",
    category: "AI / Web",
    year: "2025",
    tags: ["TypeScript", "React", "Effector", "MantineUI", "Computer Vision"],
    mark: "A",
    caseStudy: {
      subtitle:
        "Веб-сервис с CV-анализом кожи, персональными рекомендациями и аналитикой",
      platform: "Web",
      team: "0 специалистов",
      projectType: "AI / Web",
      duration: "0 месяцев",
      stackNote:
        "Интерфейс собран на React и TypeScript, состояние ведёт Effector, UI — Mantine, а разбор кожи делает Computer Vision.",
      client:
        "Онлайн-сервис для людей, которым нужна понятная рекомендация ухода по селфи и анкете.\n\nРядом с рекомендацией — возможность купить подходящее средство.",
      task:
        "Определять индивидуальные потребности по снимку и анкете.\n\nПоказать рекомендации и довести пользователя до покупки в один клик.",
      highlights: [
        {
          title: "Анализ по селфи и анкете",
          text: "Сервис оценивает состояние кожи по фотографии и ответам пользователя.",
        },
        {
          title: "Персональные рекомендации",
          text: "Подбор средств строится от индивидуальных потребностей, а не от общего каталога.",
        },
        {
          title: "Покупка в один клик",
          text: "Рекомендацию можно сразу превратить в заказ.",
        },
        {
          title: "Computer Vision",
          text: "Разбор снимка вынесен в отдельный CV-сценарий веб-сервиса.",
        },
      ],
      solution: [
        "Веб-интерфейс на React и TypeScript",
        "Состояние приложения на Effector",
        "Интерфейс на Mantine UI",
        "CV-анализ кожи и выдача рекомендаций",
      ],
      stats: templateStats,
      resultNote:
        "Пользователь получает разбор кожи и подбор средств, а сервис — сценарий от анализа до покупки.",
      productType: "AI-сервиса",
    },
  },
  {
    slug: "cabinet-wb",
    title: "Кабинет WB",
    shortDescription:
      "SaaS-платформа для аналитики и управления продажами на Wildberries: продажи, остатки, цены и финансы нескольких кабинетов селлера в едином интерфейсе.",
    description:
      "Аналитический кабинет для селлеров: дашборды, отчёты и сценарии роста продаж на стеке Next.js.",
    category: "Web & SaaS",
    year: "2024",
    tags: ["Next.js", "React", "Redux", "TypeScript", "Java"],
    mark: "W",
    caseStudy: {
      subtitle:
        "Аналитический кабинет для селлеров: дашборды, отчёты и сценарии роста продаж",
      platform: "Web / SaaS",
      team: "0 специалистов",
      projectType: "Web & SaaS",
      duration: "0 месяцев",
      stackNote:
        "Интерфейс на Next.js, React и TypeScript, состояние — Redux, серверная часть — Java.",
      client:
        "SaaS для селлеров Wildberries, которым нужно видеть продажи, остатки, цены и финансы.\n\nНесколько кабинетов собираются в одном интерфейсе.",
      task:
        "Собрать единый контур аналитики и управления продажами.\n\nДашборды и отчёты должны работать сразу по нескольким кабинетам селлера.",
      highlights: [
        {
          title: "Несколько кабинетов",
          text: "Продажи, остатки, цены и финансы разных кабинетов видны в одном месте.",
        },
        {
          title: "Дашборды и отчёты",
          text: "Аналитика собрана в сценарии, по которым селлер смотрит состояние продаж.",
        },
        {
          title: "Управление ценами и остатками",
          text: "В кабинете есть рабочие данные по ценам, остаткам и финансам.",
        },
        {
          title: "Стек кабинета",
          text: "Клиент на Next.js и Redux, серверная логика на Java.",
        },
      ],
      solution: [
        "SaaS-кабинет на Next.js, React и TypeScript",
        "Состояние интерфейса на Redux",
        "Серверная часть на Java",
        "Сводные дашборды по нескольким кабинетам селлера",
      ],
      stats: templateStats,
      resultNote:
        "Селлер смотрит продажи, остатки, цены и финансы нескольких кабинетов в одном интерфейсе.",
      productType: "веб-сервиса",
    },
  },
  {
    slug: "vodabro",
    title: "Водабро",
    shortDescription:
      "Цифровой сервис для управления доставкой и подписками на воду.",
    description:
      "Сервис подписок и доставки: личный кабинет, расписания, статусы заказов и интеграции оплаты.",
    category: "Web & SaaS",
    year: "2024",
    tags: ["React", "Node.js", "PostgreSQL"],
    mark: "В",
    caseStudy: {
      subtitle: "Сервис подписок и доставки: кабинет, расписания и статусы заказов",
      platform: "Web / SaaS",
      team: "0 специалистов",
      projectType: "Web & SaaS",
      duration: "0 месяцев",
      stackNote:
        "Клиент на React, сервер на Node.js, данные заказов и подписок — в PostgreSQL.",
      client:
        "Цифровой сервис доставки и подписок на воду.\n\nПользователю нужен кабинет с расписанием, статусом заказа и оплатой.",
      task:
        "Собрать управление доставкой и подписками в одном сервисе.\n\nЛичный кабинет, расписания, статусы заказов и оплата.",
      highlights: [
        {
          title: "Подписки",
          text: "Сервис ведёт регулярную доставку, а не только разовые заказы.",
        },
        {
          title: "Личный кабинет",
          text: "Пользователь видит расписание и статус своего заказа.",
        },
        {
          title: "Оплата",
          text: "В сценарий заказа входит интеграция оплаты.",
        },
        {
          title: "Данные заказов",
          text: "Состояние подписок и доставок хранится в PostgreSQL.",
        },
      ],
      solution: [
        "Веб-сервис на React и Node.js",
        "Личный кабинет с расписаниями и статусами",
        "Хранение заказов и подписок в PostgreSQL",
        "Интеграция оплаты в сценарий заказа",
      ],
      stats: templateStats,
      resultNote:
        "Доставка и подписки ведутся из кабинета: расписание, статус заказа и оплата в одном сервисе.",
      productType: "веб-сервиса",
    },
  },
  {
    slug: "masters-dom",
    title: "Masters:Dom",
    shortDescription:
      "Платформа для поиска мастеров и управления заявками в сфере услуг.",
    description:
      "Маркетплейс услуг: заявки, профили мастеров, статусы работ и админ-панель.",
    category: "Web & SaaS",
    year: "2024",
    tags: ["Next.js", "TypeScript", "NestJS"],
    mark: "M",
    caseStudy: {
      subtitle: "Маркетплейс услуг: заявки, профили мастеров и админ-панель",
      platform: "Web / SaaS",
      team: "0 специалистов",
      projectType: "Web & SaaS",
      duration: "0 месяцев",
      stackNote:
        "Клиент на Next.js и TypeScript, серверная часть — NestJS.",
      client:
        "Платформа, где заказчик ищет мастера и ведёт заявку.\n\nРядом — профили мастеров, статусы работ и админ-панель.",
      task:
        "Собрать поиск мастеров и управление заявками в одном продукте.\n\nНужны профили, статусы работ и отдельная админ-панель.",
      highlights: [
        {
          title: "Заявки",
          text: "Заказ проходит по статусам, а не теряется в переписке.",
        },
        {
          title: "Профили мастеров",
          text: "У исполнителя есть профиль, по которому его находят.",
        },
        {
          title: "Статусы работ",
          text: "Обе стороны видят, на каком этапе находится заявка.",
        },
        {
          title: "Админ-панель",
          text: "Управление платформой вынесено в отдельный контур.",
        },
      ],
      solution: [
        "Платформа на Next.js и TypeScript",
        "Серверная часть на NestJS",
        "Заявки, профили мастеров и статусы работ",
        "Админ-панель для управления сервисом",
      ],
      stats: templateStats,
      resultNote:
        "Заказчик находит мастера и ведёт заявку по статусам, а площадка управляется из админ-панели.",
      productType: "веб-сервиса",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectMark(project: Project): string {
  if (project.mark) return project.mark;
  const letter = project.title.trim().charAt(0);
  return letter ? letter.toUpperCase() : "?";
}

export function getProjectPosition(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  const total = projects.length;
  const next = projects[(index + 1) % total];
  return { index, total, next };
}

export const caseCta = {
  text: "Текст под тип проекта: что мы разрабатываем в этом направлении и с чем помогаем.",
  chips: ["Прозрачная оценка", "Полный цикл разработки", "Передача прав"],
};
