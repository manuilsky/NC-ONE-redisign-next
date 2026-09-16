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
