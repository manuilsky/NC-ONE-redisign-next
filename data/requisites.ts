export type RequisiteItem =
  | { text: string }
  | { prefix: string; href: string; value: string; external?: boolean };

export type RequisiteBlock = {
  title: string;
  items: RequisiteItem[];
};

export const requisites = {
  backHref: "/",
  backLabel: "←  на главную",
  label: "[ документы ]",
  title: "Реквизиты",
  titleAccent: "компании",
  blocks: [
    {
      title: "Сведения о владельце сайта",
      items: [
        { text: "ИП Меньщиков Алексей Васильевич" },
        { text: "ИНН: 744725041870" },
        { text: "ОГРНИП: 323745600170181" },
        {
          text: "Место нахождения / адрес: 454081, Челябинская область, г. Челябинск, ул. Культуры, д. 55, кв. 27",
        },
        {
          prefix: "E-mail: ",
          href: "mailto:info@ncomsoft.ru",
          value: "info@ncomsoft.ru",
        },
        {
          prefix: "Сайт: ",
          href: "https://ncomsoft.ru",
          value: "ncomsoft.ru",
          external: true,
        },
      ],
    },
    {
      title: "Банковские реквизиты",
      items: [
        { text: "Р/с: 40802810900005336335" },
        { text: "Банк: АО «Т-Банк»" },
        { text: "БИК: 044525974" },
        { text: "К/с: 30101810145250000974" },
      ],
    },
  ] satisfies RequisiteBlock[],
};
