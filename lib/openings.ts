export type Opening = {
  org: string;
  role: string;
  summary: string;
  tags: string[];
  cta: string;
  email?: string;
  url?: string;
  match?: boolean;
};

export type OpeningsFeed = {
  title: string;
  intro: string;
  openings: Opening[];
};
