import tagsData from "@/data/tags.json";

export type TagFeed = {
  title: string;
  subtitle?: string;
  items: string[];
};

export const tags: TagFeed = tagsData;
