export type WhyUsItem = {
  id: string;
  title: string;
  text: string;
};

export type StatItem = {
  value: string;
  label: string;
  compactLabel?: boolean;
};

export type ServiceItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
};

export type HomeProject = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  mark: string;
};

export const hero = {
  titleLines: ["Архитектура", "цифрового", "будущего"] as const,
  accentLineIndex: 1,
  subtitle:
    "Ваш глобальный технологический партнёр в разработке передовых IT-продуктов любой сложности.",
  cta: "Обсудить проект",
  scrollHint: "Прокрутите для запуска",
};

export const about = {
  label: "[ о нас ]",
  paragraphs: [
    "НК 1 — международная IT-компания, которая с 2020 года занимается комплексной разработкой масштабируемых продуктов с нуля и модернизацией существующих систем. Превращаем сложные бизнес-вызовы в высоконагруженные веб-сервисы, мобильные приложения и передовые AI-системы.",
    "Расскажите о вашем проекте: наши специалисты проанализируют задачи, составят уникальное предложение и подберут оптимальный бюджет.",
  ],
  cta: "Оставить заявку",
};

export const stats: StatItem[] = [
  { value: "6", label: "лет на рынке" },
  { value: "80+", label: "специалистов в команде" },
  { value: "50+", label: "сложных систем построено" },
  { value: "3 млн+", label: "пользователей в наших продуктах" },
  {
    value: "99.9%",
    label: "отказоустойчивость (Uptime) инфраструктур",
    compactLabel: true,
  },
  { value: "100%", label: "проектов под строгим NDA" },
];

export const whyUs: WhyUsItem[] = [
  {
    id: "no-risk",
    title: "Без рисков",
    text: "Фиксируем этапы, критерии приёмки и прозрачную отчётность до старта работ.",
  },
  {
    id: "guarantee",
    title: "Гарантия",
    text: "Сопровождаем релиз и закрываем гарантийные доработки по согласованному SLA.",
  },
  {
    id: "sprints",
    title: "Спринты",
    text: "Работаем короткими итерациями с демо, чтобы вы быстрее видели результат.",
  },
  {
    id: "nda",
    title: "Строгий NDA",
    text: "Все проекты ведутся под NDA: код, данные и доступы защищены процессами.",
  },
  {
    id: "ownership",
    title: "Передача прав",
    text: "По завершению вы получаете полный IP, репозитории и документацию.",
  },
  {
    id: "partner",
    title: "Партнёрство",
    text: "Остаёмся техническим партнёром: развитие продукта, DevOps и поддержка.",
  },
];

export const servicesIntro = {
  label: "[ наши услуги ]",
  title: "Разработка ПО и технологическая экспертиза",
  lead:
    "Полный цикл: от аудита и архитектуры до релиза, облака и дальнейшего развития продукта.",
};

export const services: ServiceItem[] = [
  {
    id: "web",
    number: "01",
    title: "Веб-разработка и Backend Development",
    description:
      "Продуктовые веб-платформы, личные кабинеты, API и backend-системы с упором на скорость и масштабирование.",
    tags: [
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "Node.js",
      "NestJS",
      "PostgreSQL",
      "Docker",
    ],
  },
  {
    id: "mobile",
    number: "02",
    title: "Разработка мобильных приложений",
    description:
      "Нативные и кроссплатформенные приложения с офлайн-сценариями, push и интеграциями.",
    tags: ["Flutter", "Dart", "Swift", "Kotlin", "React Native", "Firebase"],
  },
  {
    id: "ai",
    number: "03",
    title: "AI-разработка, Machine Learning и Computer Vision",
    description:
      "Модели, пайплайны инференса и CV-сценарии, встроенные в продуктовый UX.",
    tags: ["Python", "PyTorch", "OpenCV", "LLM", "Computer Vision", "MLOps"],
  },
  {
    id: "data",
    number: "04",
    title: "Data Engineering и Highload системы",
    description:
      "Потоки данных, аналитика и высоконагруженные сервисы с предсказуемой производительностью.",
    tags: ["Kafka", "ClickHouse", "Redis", "Kubernetes", "ETL", "Observability"],
  },
  {
    id: "devops",
    number: "05",
    title: "DevOps, Cloud и инфраструктурная безопасность",
    description:
      "CI/CD, облачная инфраструктура, мониторинг и практики безопасности для продакшена.",
    tags: ["AWS", "GCP", "Terraform", "GitHub Actions", "Prometheus", "Security"],
  },
  {
    id: "audit",
    number: "06",
    title: "Аудит, модернизация и поддержка ПО",
    description:
      "Аудит легаси, план модернизации, рефакторинг и сопровождение критичных систем.",
    tags: ["Architecture Review", "Refactoring", "SLA", "Support", "Migration"],
  },
];

export const partnerCta = {
  label: "[ следующий шаг ]",
  titleBefore: "Ищете надёжного ",
  titleAccent: "технического партнёра",
  titleAfter: "?",
  tags: ["Прозрачная оценка", "Полный цикл разработки", "Передача прав"],
  cta: "Обсудить проект",
};

export const projectsSection = {
  label: "[ портфолио ]",
  title: "Наши проекты говорят за нас",
  cta: "Все проекты",
};

export const homeProjects: HomeProject[] = [
  {
    slug: "novakids",
    title: "NovaKids",
    description:
      "Мобильное приложение для детей 7–10 лет с игровыми сценариями и computer vision.",
    tags: ["Flutter", "Dart", "REST API", "Computer Vision"],
    mark: "N",
  },
  {
    slug: "ai-beauty-advisor",
    title: "AI Beauty Advisor",
    description:
      "Онлайн-сервис анализа кожи по селфи и персональных рекомендаций.",
    tags: ["TypeScript", "React", "Effector", "Computer Vision"],
    mark: "A",
  },
  {
    slug: "cabinet-wb",
    title: "Кабинет WB",
    description:
      "SaaS-платформа аналитики для продавцов Wildberries: метрики, отчёты, рост продаж.",
    tags: ["Next.js", "React", "Redux"],
    mark: "W",
  },
  {
    slug: "vodabro",
    title: "Водабро",
    description:
      "Цифровой сервис для управления доставкой и подписками на воду.",
    tags: ["React", "Node.js", "PostgreSQL"],
    mark: "V",
  },
  {
    slug: "masters-dom",
    title: "Masters:Dom",
    description:
      "Платформа для поиска мастеров и управления заявками в сфере услуг.",
    tags: ["Next.js", "TypeScript", "NestJS"],
    mark: "M",
  },
];

export const finalCta = {
  title: "Готовы запустить ваш проект?",
  text: "Опишите задачу — вернёмся с оценкой и предложением по команде.",
  phone: "+7 (000) 000-00-00",
  email: "hello@nc-one.example",
  cta: "Связаться с нами",
};
