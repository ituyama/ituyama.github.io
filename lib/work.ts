import workData from "@/data/work.json";

export type WorkItem = {
  name: string;
  role: string;
  summary?: string;
  url?: string;
  focus?: string[];
};

export type WorkFeed = {
  title: string;
  items: WorkItem[];
};

export const work: WorkFeed = workData;
