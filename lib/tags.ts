import tagsData from "@/data/tags.json";

export type TagFeed = {
  title: string;
  subtitle?: string;
  cta?: string;
  items: string[];
};

export const tags: TagFeed = tagsData;
