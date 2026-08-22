export const CONTACT_API_PATH = "/api/contact";

export const NOTIFY_EMAIL = "ituyama01@gmail.com";

export type ContactIntent = {
  subject: string;
  source: string;
  defaultMessage?: string;
};

export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  subject: string;
  source: string;
};

export type ContactResponse = {
  ok: boolean;
  error?: string;
};
