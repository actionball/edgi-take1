import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Tables } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Video } from "@/lib/query.types";
import styles from "./Sidebar.module.css";

type Like = Tables<"likes">;

// function FooterRight({ likes, comments, saves, shares, profilePic }) {
export default function LikeButton({
  userId,
  video,
}: {
  userId: string;
  video: Video;
}) {
  const supabase = createClientComponentClient();

  const likes =
    (video.tiktok_like_count || 0) +
    video.likes_count[0]?.count -
    (video.user_likes.length ? 1 : 0);
  const [like, setLike] = useState<Like | null>(video.user_likes[0]);

  const deleteLike = async (like: Like) => {
    if (!like.id) return;
    // Optimistically set the like to null before the database operation
    setLike(null);
    const { error } = await supabase
      .from("likes")
      .delete()
      .match({ id: like.id });

    if (error) {
      setLike(like); // Reset like if the database call fails
      alert("There was a problem unliking the video. Please try again.");
    }
  };

  const insertLike = async () => {
    // Optimistically set a like before the database operation
    const likeData = { user_id: userId, video_id: video.id };
    setLike({ id: "", created_at: "", comment_id: null, ...likeData });

    const { data, error } = await supabase
      .from("likes")
      .insert(likeData)
      .select();

    if (error || !data) {
      setLike(null); // Reset like if the database call fails
      alert("There was a problem liking the video. Please try again.");
    } else {
      setLike(data[0]);
    }
  };

  const handleLikeClick = () => {
    if (like) deleteLike(like);
    else insertLike();
  };

  return (
    <div className={styles.sidebarIcon} onClick={() => handleLikeClick()}>
      {/* The heart icon for liking */}
      <FontAwesomeIcon
        icon={faHeart}
        style={{
          width: "35px",
          height: "35px",
          color: like ? "#FF0000" : "white",
        }}
      />
      {/* Displaying the formatted likes count */}
      <p>{likes + (like ? 1 : 0)}</p>
    </div>
  );
}
