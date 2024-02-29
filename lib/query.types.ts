import { Tables } from "./database.types";

export type Video = Tables<"videos"> & {
  creator: Tables<"creators"> & {
    follows_count: { count: number }[];
    userFollows: Tables<"follows">[];
  };
  bookmarks_count: { count: number }[];
  comments_count: { count: number }[];
  likes_count: { count: number }[];
  tiktok_comment_count: number | null;
  tiktok_like_count: number | null;
  tiktok_play_count: number | null;
  tiktok_save_count: number | null;
  tiktok_share_count: number | null;
  user_bookmarks: Tables<"bookmarks">[];
  user_likes: Tables<"likes">[];
};
