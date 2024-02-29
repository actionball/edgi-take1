"use client";

import Feed from "@/components/Feed/Feed";
import Spinner from "@/components/Spinner";
import { Video } from "@/lib/query.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { shuffle } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [videos, setVideos] = useState<Video[] | null>(null);

  const loadVideos = async (user: User) => {
    const { data } = await supabase
      .from("videos")
      .select(
        `
        *,
        creator:creator_id (
          *,
          follows_count:follows(count),
          userFollows:follows (id, user_id)
        ),
        bookmarks_count:bookmarks(count),
        comments_count:comments(count),
        likes_count:likes(count),
        tiktok_comment_count,
        tiktok_like_count,
        tiktok_play_count,
        tiktok_save_count,
        tiktok_share_count,
        user_bookmarks:bookmarks (id, user_id),
        user_likes:likes (id, user_id)
        `
      )
      .eq("user_likes.user_id", user?.id)
      .eq("user_bookmarks.user_id", user?.id)
      .eq("creator.userFollows.user_id", user?.id)
      .order("tiktok_id", { ascending: Math.random() > 0.5 })
      .limit(500);
    setVideos(shuffle(data));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return router.push("/login");
      loadVideos(session.user);
    });
  }, [router]);

  if (!videos) return <Spinner />;
  return <Feed videos={videos} />;
}
