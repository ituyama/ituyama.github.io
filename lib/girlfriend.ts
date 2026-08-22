export type GirlfriendPayload = {
  hasGirlfriend: false;
};

/** 彼女 API — 常に false（ネタ） */
export const girlfriendPayload: GirlfriendPayload = {
  hasGirlfriend: false,
};

export const GIRLFRIEND_API_PATH = "/api/girlfriend";
