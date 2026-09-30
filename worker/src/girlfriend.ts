import { girlfriendPayload, type GirlfriendPayload } from "../../lib/girlfriend";

export type { GirlfriendPayload };

export function girlfriendResponse(): GirlfriendPayload {
  return girlfriendPayload;
}
