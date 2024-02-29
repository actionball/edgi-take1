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
          followsCount:follows(count),
          userFollows:follows (id, user_id)
        ),
        bookmarksCount:bookmarks(count),
        commentsCount:comments(count),
        likesCount:likes(count),
        userBookmarks:bookmarks (id, user_id),
        userLikes:likes (id, user_id)
        `
      )
      .eq("userLikes.user_id", user?.id)
      .eq("userBookmarks.user_id", user?.id)
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
