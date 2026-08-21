import matchData from "@/data/match.json";

export type MatchScreen = {
  kicker: string;
  title: string;
  copy: string;
  messageCta?: string;
  retryCta?: string;
  closeCta: string;
};

export type MatchFeed = {
  title: string;
  photos: string[];
  area: string;
  bio: string;
  avatar: string;
  hint: string;
  stamps: { like: string; nope: string };
  viewerLabel: string;
  viewerAvatar: string;
  mailto: { subject: string; body: string };
  matched: MatchScreen;
  nope: MatchScreen;
  actions: {
    like: string;
    nope: string;
    photoPrev: string;
    photoNext: string;
    close: string;
  };
};

export const match: MatchFeed = matchData;
