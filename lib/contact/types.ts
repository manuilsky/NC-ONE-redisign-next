export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  comment: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  website?: string;
};

export type ContactField = keyof Pick<
  ContactPayload,
  "name" | "email" | "phone" | "comment" | "consent"
>;

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactSuccessResponse = {
  ok: true;
};

export type ContactErrorResponse = {
  ok: false;
  error: string;
  fields?: ContactFieldErrors;
};

export type ContactResponse = ContactSuccessResponse | ContactErrorResponse;
