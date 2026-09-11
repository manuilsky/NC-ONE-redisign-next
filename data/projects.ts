export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  year: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: "novakids",
    title: "NovaKids",
    shortDescription:
      "Мобильное приложение для детей 7–10 лет с игровыми сценариями и computer vision.",
    description:
      "Мобильный продукт для детей: игровые механики, безопасный UX и computer vision-сценарии. Кроссплатформенная разработка на Flutter с REST API.",
    category: "Mobile Apps",
    year: "2025",
    tags: ["Flutter", "Dart", "REST API", "Computer Vision"],
  },
  {
    slug: "ai-beauty-advisor",
    title: "AI Beauty Advisor",
    shortDescription:
      "Онлайн-сервис анализа кожи по селфи и персональных рекомендаций.",
    description:
      "Веб-сервис с CV-анализом кожи, персональными рекомендациями и продуктовой аналитикой. Frontend на React/TypeScript.",
    category: "AI / Web",
    year: "2025",
    tags: ["TypeScript", "React", "Effector", "Computer Vision"],
  },
  {
    slug: "cabinet-wb",
    title: "Кабинет WB",
    shortDescription:
      "SaaS-платформа аналитики для продавцов Wildberries: метрики, отчёты, рост продаж.",
    description:
      "Аналитический кабинет для селлеров: дашборды, отчёты и сценарии роста продаж на стеке Next.js.",
    category: "Web & SaaS",
    year: "2024",
    tags: ["Next.js", "React", "Redux"],
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
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
