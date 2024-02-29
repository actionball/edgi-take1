import React, { useState } from "react";
import { Comment, Like } from "./Comment.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./Icon.module.css";

// function FooterRight({ likes, comments, saves, shares, profilePic }) {
export default function LikeButton({
  userId,
  comment,
}: {
  userId: string;
  comment: Comment;
}) {
  const supabase = createClientComponentClient();

  const likesCount = comment.likes_count?.[0]?.count || 0;
  const userLikes = comment.user_likes || [];
  const likes = likesCount - (userLikes.length ? 1 : 0);
  const [like, setLike] = useState<Like | null>(userLikes[0]);

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
      alert("There was a problem unliking the comment. Please try again.");
    }
  };

  const insertLike = async () => {
    // Optimistically set a like before the database operation
    const likeData = { user_id: userId, comment_id: comment.id };
    setLike({ id: "", created_at: "", video_id: null, ...likeData });

    const { data, error } = await supabase
      .from("likes")
      .insert(likeData)
      .select();

    if (error || !data) {
      setLike(null); // Reset like if the database call fails
      alert("There was a problem liking the comment. Please try again.");
    } else {
      setLike(data[0]);
    }
  };

  const handleLikeClick = () => {
    if (like) deleteLike(like);
    else insertLike();
  };

  return (
    <>
      <FontAwesomeIcon
        icon={faHeart}
        className={`${styles.icon} ${like ? styles.liked : ""}`}
        onClick={() => handleLikeClick()}
      />{" "}
      {likes + (like ? 1 : 0)}
    </>
  );
}
