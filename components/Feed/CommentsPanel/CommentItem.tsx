import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Comment } from "./Comment.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./Icon.module.css";
import LikeButton from "./LikeButton";

// function FooterRight({ follows, comments, saves, shares, profilePic }) {
export default function CommentItem({
  comment,
  userId,
  onDelete,
}: {
  comment: Comment;
  userId: string | undefined;
  onDelete: (comment: Comment) => void;
}) {
  const supabase = createClientComponentClient();
  let profilePic = "https://i.pravatar.cc/300";
  if (comment.profile.avatar_filename) {
    profilePic = supabase.storage
      .from("avatars")
      .getPublicUrl(comment.profile.avatar_filename).data.publicUrl;
  }
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClickDelete = () => {
    if (isDeleting) return;
    if (!confirm("Delete this comment?")) return;
    setIsDeleting(true);

    supabase
      .from("comments")
      .delete()
      .eq("id", comment.id)
      .then(({ error, data }) => {
        console.log("delete", error, data);
        if (error) {
          alert("there was a problem deleting the comment");
          setIsDeleting(false);
          return;
        }

        onDelete(comment);
      });
  };

  return (
    <div className="flex">
      <img
        src={profilePic}
        alt="Profile"
        className="rounded-full w-10 h-10 mr-2"
      />
      <div className="flex-grow text">
        <div className="font-bold mr-1 text-gray-400">
          {comment.profile.username}
        </div>
        <div>{comment.body}</div>
        <div className="flex items-center justify-between text-sm w-full text-gray-400">
          <div className="mr-2">3h</div>
          <div>
            <div className="flex items-center cursor-pointer">
              {userId == comment.user_id && (
                <FontAwesomeIcon
                  icon={faTrash}
                  className={styles.icon}
                  onClick={handleClickDelete}
                />
              )}
              {userId ? <LikeButton userId={userId} comment={comment} /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
