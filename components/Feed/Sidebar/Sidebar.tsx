import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faShare } from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Video } from "@/lib/query.types";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import FollowButton from "./FollowButton";

export default function Sidebar({
  onClickComment,
  video,
}: {
  onClickComment: () => void;
  video: Video;
}) {
  const supabase = createClientComponentClient();

  const shares = 30;
  const [userId, setUserId] = useState("");

  supabase.auth.getSession().then(({ data }) => {
    setUserId(data.session?.user?.id || "");
  });

  return (
    <div className={styles.container}>
      <FollowButton userId={userId} video={video} />
      <LikeButton userId={userId} video={video} />
      <div className={styles.sidebarIcon} onClick={onClickComment}>
        {/* The comment icon */}
        <FontAwesomeIcon
          icon={faCommentDots}
          style={{ width: "35px", height: "35px", color: "white" }}
        />
        {/* Displaying the number of comments */}
        <p>{video.commentsCount[0].count}</p>
      </div>
      <BookmarkButton userId={userId} video={video} />
      <div className={styles.sidebarIcon}>
        {/* The share icon */}
        <FontAwesomeIcon
          icon={faShare}
          style={{ width: "35px", height: "35px", color: "white" }}
        />
        {/* Displaying the number of shares */}
        <p>{shares}</p>
      </div>
      <div className={`${styles.sidebarIcon} ${styles.record}`}>
        {/* Displaying the record icon */}
        <img
          src="https://static.thenounproject.com/png/934821-200.png"
          alt="Record Icon"
        />
      </div>
    </div>
  );
}
