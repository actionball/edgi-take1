import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { Tables } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Video } from "@/lib/query.types";
import styles from "./Sidebar.module.css";

type Follow = Tables<"follows">;

// function FooterRight({ follows, comments, saves, shares, profilePic }) {
export default function FollowButton({
  userId,
  video: { creator },
}: {
  userId: string;
  video: Video;
}) {
  const supabase = createClientComponentClient();
  const profilePic = "https://i.pravatar.cc/300";

  const follows =
    creator.followsCount[0]?.count - (creator.userFollows.length ? 1 : 0);
  const [follow, setFollow] = useState<Follow | null>(creator.userFollows[0]);

  const deleteFollow = async (follow: Follow) => {
    if (!follow.id) return;
    // Optimistically set the follow to null before the database operation
    setFollow(null);
    const { error } = await supabase
      .from("follows")
      .delete()
      .match({ id: follow.id });

    if (error) {
      setFollow(follow); // Reset follow if the database call fails
      alert("There was a problem unliking the video. Please try again.");
    }
  };

  const insertFollow = async () => {
    // Optimistically set a follow before the database operation
    const followData = { user_id: userId, creator_id: creator.id };
    setFollow({ id: "", created_at: "", ...followData });

    const { data, error } = await supabase
      .from("follows")
      .insert(followData)
      .select();

    if (error || !data) {
      setFollow(null); // Reset follow if the database call fails
      alert("There was a problem liking the video. Please try again.");
    } else {
      setFollow(data[0]);
    }
  };

  const handleFollowClick = () => {
    if (follow) deleteFollow(follow);
    else insertFollow();
  };

  return (
    <div className={styles.sidebarIcon}>
      <img
        src={profilePic}
        className={styles.userprofile}
        alt="Profile"
        style={{ width: "45px", height: "45px", color: "#616161" }}
      />
      <FontAwesomeIcon
        icon={follow ? faCircleCheck : faCirclePlus}
        className={styles.useradd}
        style={{
          width: "15px",
          height: "15px",
          color: "#FF0000",
        }}
        onClick={handleFollowClick}
      />
    </div>
  );
}
