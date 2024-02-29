import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Tables } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Video } from "@/lib/query.types";
import styles from "./Sidebar.module.css";

type Bookmark = Tables<"bookmarks">;

// function FooterRight({ bookmarks, comments, saves, shares, profilePic }) {
export default function BookmarkButton({
  userId,
  video,
}: {
  userId: string;
  video: Video;
}) {
  const supabase = createClientComponentClient();

  const bookmarks =
    (video.tiktok_save_count || 0) +
    video.bookmarks_count[0]?.count -
    (video.user_bookmarks.length ? 1 : 0);
  const [bookmark, setBookmark] = useState<Bookmark | null>(
    video.user_bookmarks[0]
  );

  const deleteBookmark = async (bookmark: Bookmark) => {
    if (!bookmark.id) return;
    // Optimistically set the bookmark to null before the database operation
    setBookmark(null);
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .match({ id: bookmark.id });

    if (error) {
      setBookmark(bookmark); // Reset bookmark if the database call fails
      alert("There was a problem unliking the video. Please try again.");
    }
  };

  const insertBookmark = async () => {
    // Optimistically set a bookmark before the database operation
    const bookmarkData = { user_id: userId, video_id: video.id };
    setBookmark({ id: "", created_at: "", ...bookmarkData });

    const { data, error } = await supabase
      .from("bookmarks")
      .insert(bookmarkData)
      .select();

    if (error || !data) {
      setBookmark(null); // Reset bookmark if the database call fails
      alert("There was a problem liking the video. Please try again.");
    } else {
      setBookmark(data[0]);
    }
  };

  const handleClick = () => {
    if (!userId) return;
    if (bookmark) deleteBookmark(bookmark);
    else insertBookmark();
  };

  return (
    <div className={styles.sidebarIcon} onClick={() => handleClick()}>
      {bookmark ? (
        // Displaying the bookmark icon when saved
        <FontAwesomeIcon
          icon={faBookmark}
          style={{ width: "35px", height: "35px", color: "#ffc107" }}
        />
      ) : (
        // Displaying the bookmark icon when not saved
        <FontAwesomeIcon
          icon={faBookmark}
          style={{ width: "35px", height: "35px", color: "white" }}
        />
      )}
      {/* Displaying the number of saves */}
      <p>{bookmark ? bookmarks + 1 : bookmarks}</p>
    </div>
  );
}
