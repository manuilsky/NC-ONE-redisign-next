export type WhyUsItem = {
  id: string;
  number: string;
  title: string;
  text: string;
  footerLabel: string;
  footerHighlight: string;
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

export const whyUsIntro = {
  label: "[ преимущества ]",
  titleBefore: "Почему ",
  titleAccent: "мы",
};

export const whyUs: WhyUsItem[] = [
  {
    id: "result-payment",
    number: "01",
    title: "Оплата за результат",
    text: "Вы платите только после того, как лично «прокликаете» и утвердите рабочую версию (MVP) вашего проекта.",
    footerLabel: "подход",
    footerHighlight: "без рисков",
  },
  {
    id: "deadlines",
    number: "02",
    title: "Сроки и качество",
    text: "Строго соблюдаем тайминг и доводим каждый проект до конца. Официальный договор — нужный результат в оговоренный срок без компромиссов.",
    footerLabel: "договор",
    footerHighlight: "гарантия",
  },
  {
    id: "agile",
    number: "03",
    title: "Прозрачность (Agile)",
    text: "Вы всегда знаете, на каком этапе находится проект. Ценим ваше время, работаем по чётким спринтам и не нарушаем договорённости.",
    footerLabel: "контроль",
    footerHighlight: "спринты",
  },
  {
    id: "profit",
    number: "04",
    title: "Фокус на прибыли",
    text: "Создаём IT-инструмент, упрощающий аналитику, повышающий лояльность клиентов и увеличивающий продажи. Не просто код, а прибыль.",
    footerLabel: "цель",
    footerHighlight: "рост",
  },
  {
    id: "ai",
    number: "05",
    title: "Инновации и ИИ",
    text: "Внедряем нейросети и передовой стек технологий. Автоматизируем рутину, ускоряем обработку данных и даём вашему продукту мощное технологическое преимущество.",
    footerLabel: "технологии",
    footerHighlight: "ai-driven",
  },
  {
    id: "team",
    number: "06",
    title: "Сильная команда",
    text: "В разработке участвуют только Middle+ и Senior инженеры. Мы не учимся на ваших проектах, а применяем глубокую экспертизу для решения нетривиальных задач.",
    footerLabel: "экспертиза",
    footerHighlight: "hard skills",
  },
];

export const servicesIntro = {
  label: "[ наши услуги ]",
  title: "Разработка и технологическая экспертиза",
  lead:
    "Создаем кастомное программное обеспечение для бизнеса: высоконагруженные веб-сервисы, мобильные приложения, SaaS-платформы и AI-решения. Мы закрываем полный цикл технических задач — от проектирования отказоустойчивой архитектуры с нуля до бесшовной интеграции в существующую ИТ-инфраструктуру и глубокой модернизации legacy-систем.",
};

export const services: ServiceItem[] = [
  {
    id: "web",
    number: "01",
    title: "Веб-разработка и Backend Development",
    description:
      "Разрабатываем сложные веб-приложения, CRM и ERP-системы, SaaS-платформы, маркетплейсы, e-commerce и B2B-кабинеты. Проектируем API, микросервисную архитектуру и интеграции с корпоративными и внешними сервисами.",
    tags: [
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "Nuxt.js",
      "Angular",
      "Tailwind CSS",
      "Python",
      "FastAPI",
      "Django",
      "Node.js",
      "NestJS",
      "Go",
      "Java",
      "Spring Boot",
      "C#",
      ".NET Core",
      "PHP",
      "Laravel",
    ],
  },
  {
    id: "mobile",
    number: "02",
    title: "Разработка мобильных приложений",
    description:
      "Создаем нативные и кроссплатформенные мобильные приложения для iOS и Android — от MVP до сложных цифровых продуктов. Реализуем бизнес-логику, платежи, геолокацию, геймификацию, IoT-функции и интеграции с внешними системами.",
    tags: ["Flutter", "Swift", "Kotlin", "React Native"],
  },
  {
    id: "ai",
    number: "03",
    title: "AI-разработка, Machine Learning и Computer Vision",
    description:
      "Разрабатываем AI-агентов и интеллектуальные системы для автоматизации бизнес-процессов. Интегрируем LLM и RAG, создаем системы компьютерного зрения, скоринговые и ML-модели, интеллектуальный поиск и решения для обработки и анализа данных.",
    tags: [
      "PyTorch",
      "LangChain ",
      "LlamaIndex ",
      "Scikit-learn",
      "CatBoost",
      "vLLM",
      "Hugging Face",
      "OpenCV",
      "YOLO",
      "SAM 2",
      "TensorRT",
      "MediaPipe",
      "ONNX Runtime",
      "Qdrant",
      "pgvector",
      "Milvus",
      "OpenAI API",
      "Gemini API",
      "Anthropic API",
    ],
  },
  {
    id: "data",
    number: "04",
    title: "Data Engineering и Highload системы",
    description:
      "Проектируем системы для сбора, обработки и анализа больших объемов данных. Создаем ETL/ELT-пайплайны, потоковую обработку данных, аналитическую инфраструктуру и архитектуру для высоконагруженных сервисов.",
    tags: [
      "Apache Kafka",
      "Apache Spark",
      "Apache Airflow",
      "Polars",
      "dbt",
      "PostgreSQL",
      "Redis",
      "MongoDB",
      "ClickHouse",
      "Elasticsearch",
    ],
  },
  {
    id: "devops",
    number: "05",
    title: "DevOps, Cloud и инфраструктурная безопасность",
    description:
      "Проектируем отказоустойчивую cloud-инфраструктуру, автоматизируем CI/CD и развертывание приложений. Настраиваем контейнеризацию, Kubernetes-кластеры и масштабирование сервисов, внедряем Zero Trust и защищаем инфраструктуру от DDoS-атак.",
      tags: [
        "AWS",
        "Google Cloud",
        "Docker",
        "Kubernetes",
        "Terraform",
        "CI/CD pipelines",
      ],
  },
  {
    id: "audit",
    number: "06",
    title: "Аудит, модернизация и поддержка ПО",
    description:
      "Проводим технический аудит существующих систем, рефакторинг и модернизацию legacy-проектов. Оптимизируем производительность, повышаем отказоустойчивость, настраиваем тестирование и помогаем перенести продукты на современную архитектуру. Берем системы на дальнейшее развитие и техническую поддержку.",
    tags: [    
    ],
  },
];

export const servicesMore =
  "Также помогаем с: Discovery и проектированием архитектуры · MVP и Proof of Concept · API-интеграциями · QA и автоматизацией тестирования · миграцией legacy-систем · технической поддержкой и развитием продукта.";

export const partnerCta = {
  label: "[ следующий шаг ]",
  titleLine: "Ищете надёжного",
  titleAccent: "технического партнёра?",
  text: "Подключимся на любом этапе — от идеи и архитектуры до разработки, запуска, модернизации и дальнейшего развития системы.",
  tags: ["Прозрачная оценка", "Полный цикл разработки", "Передача прав"],
  cta: "Обсудить проект",
};

export const projectsSection = {
  label: "[ портфолио ]",
  titleChunks: ["Наши", "проекты"] as const,
  titleAccentChunks: ["говорят за", "нас"] as const,
  cta: "Больше проектов",
};

export const finalCta = {
  label: "[ свяжитесь с нами ]",
  titleLines: ["Готовы", "запустить", "ваш проект?"] as const,
  accentLineIndexes: [1] as const,
  projectsTitleLines: ["Превратим", "вашу идею", "в продукт"] as const,
  projectsAccentLineIndexes: [1] as const,
  text: "Расскажите о задаче — составим уникальное предложение и подберём оптимальный бюджет.",
  phone: "+7 916 945 7964",
  phoneHref: "tel:+79169457964",
  email: "info@ncomsoft.ru",
  telegramLabel: "Telegram",
  telegramHref: "https://t.me/Ncomsoft1",
  form: {
    name: "Имя",
    email: "email@mail.com",
    phone: "+0 000 000 0000",
    comment: "Комментарий",
    consentBefore: "Я даю согласие на ",
    consentLink: "обработку персональных данных",
    consentHref: "/consent",
    submit: "Отправить заявку",
    submitting: "Отправляем…",
    success: "Заявка отправлена. Мы свяжемся с вами в ближайшее время.",
    errorFallback:
      "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.",
  },
};

export const footer = {
  copyrightFrom: 2019,
  entity: "НК 1 · ИП Меньщиков А.В. · ИНН 744725041870",
  rights: "Все права защищены",
  links: [
    { href: "/privacy", label: "Политика конфиденциальности" },
    { href: "/cookies", label: "Использование cookie" },
    { href: "/requisites", label: "Реквизиты" },
  ],
};
