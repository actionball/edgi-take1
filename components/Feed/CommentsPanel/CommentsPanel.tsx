import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Comment } from "./Comment.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Video } from "@/lib/query.types";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

// function FooterRight({ follows, comments, saves, shares, profilePic }) {
export default function CommentsPanel({
  onClickClose,
  video,
}: {
  onClickClose: () => void;
  video: Video;
}) {
  const supabase = createClientComponentClient();

  const [rendered, setRendered] = useState(false);
  const [comments, setComments] = useState<Comment[] | undefined>();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const loadComments = async (userId: string) => {
    // load the comments
    const { data } = await supabase
      .from("comments")
      .select(
        `
      *,
      profile:profiles (username, avatar_filename),
      likes_count:likes(count),
      user_likes:likes (id, user_id)
      `
      )
      .eq("video_id", video.id)
      .eq("user_likes.user_id", userId)
      .limit(100);

    if (!data) return alert("there was a problem loading comments");
    setComments(data);
  };

  useEffect(() => {
    setTimeout(() => setRendered(true), 1);

    supabase.auth.getSession().then(({ data }) => {
      if (!data?.session?.user.id) {
        alert("there was a problem loading comments");
        return onClickClose();
      }
      setUserId(data.session?.user.id);
      loadComments(data.session?.user.id);
    });
  }, []);

  const handleDelete = (comment: Comment) => {
    setComments(comments?.filter((c) => c.id !== comment.id));
  };

  const handleCreate = (comment: Comment) => {
    setComments(comments?.concat(comment));
  };

  return (
    <div className="absolute h-full w-full">
      <div
        className="transition-all bg-black ease-out"
        style={{
          transitionDuration: "200ms",
          height: rendered ? "30%" : "100%",
          backgroundColor: rendered ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0)",
        }}
        onClick={onClickClose}
      >
        &nbsp;
      </div>
      <div
        className="w-full h-full bg-white rounded-t-lg transition-all ease-out flex flex-col"
        style={{
          transitionDuration: "200ms",
          height: rendered ? "70%" : "0%",
        }}
      >
        <div className="relative">
          <div className="flex items-center justify-center text-sm font-bold h-14">
            {`${video.comments_count[0].count} ${
              video.comments_count[0].count === 1 ? "Comment" : "Comments"
            }`}
          </div>
          <button
            className="absolute right-0 top-0 flex items-center justify-center h-14 px-4"
            onClick={onClickClose}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{ width: "16px", height: "16px" }}
            />
          </button>
        </div>
        <div className="p-4 flex-grow overflow-y-scroll">
          {comments?.map((comment) => (
            <div className="mb-4" key={comment.id}>
              <CommentItem
                comment={comment}
                userId={userId}
                onDelete={() => handleDelete(comment)}
              />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <CommentInput userId={userId} video={video} onCreate={handleCreate} />
        </div>
      </div>
    </div>
  );
}
