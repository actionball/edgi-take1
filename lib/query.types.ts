import { Tables } from "./database.types";

export type Video = Tables<"videos"> & {
  creator: Tables<"creators"> & {
    followsCount: { count: number }[];
    userFollows: Tables<"follows">[];
  };
  bookmarksCount: { count: number }[];
  commentsCount: { count: number }[];
  likesCount: { count: number }[];
  userBookmarks: Tables<"bookmarks">[];
  userLikes: Tables<"likes">[];
};
