import hireData from "@/data/hire.json";

export type HireOpening = {
  org: string;
  role: string;
  summary: string;
  tags: string[];
  cta: string;
  email?: string;
  url?: string;
};

export type HireFeed = {
  title: string;
  intro: string;
  openings: HireOpening[];
};

export const hire: HireFeed = hireData;
