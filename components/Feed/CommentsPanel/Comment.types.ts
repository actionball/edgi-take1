import { Tables } from "@/lib/database.types";

export type Like = Tables<"likes">;
export type Comment = Tables<"comments"> & {
  profile: Tables<"profiles">;
  likes_count: { count: number }[];
  user_likes: Like[];
};
