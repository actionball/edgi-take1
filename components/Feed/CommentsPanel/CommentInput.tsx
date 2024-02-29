import React, { useState } from "react";
import { Tables } from "@/lib/database.types";
import { Comment } from "./Comment.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";

type Video = Tables<"videos">;

// function FooterRight({ follows, comments, saves, shares, profilePic }) {
export default function CommentInput({
  onCreate,
  userId,
  video,
}: {
  onCreate: (comment: Comment) => void;
  userId: string | undefined;
  video: Video;
}) {
  const supabase = createClientComponentClient();
  const profilePic = "https://i.pravatar.cc/300";
  const [body, setBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    supabase
      .from("comments")
      .insert({ body, video_id: video.id, user_id: userId })
      .select(`*, profile:profiles (username)`)
      .then(({ data, error }) => {
        if (error || !data) {
          alert("there was a problem creating the comment");
          setIsSaving(false);
          return;
        }

        onCreate(data[0]);
        setBody("");
        setIsSaving(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <img
        src={profilePic}
        alt="Profile"
        className="rounded-full w-10 h-10 mr-2"
      />
      <div className="flex-grow relative">
        <input
          type="text"
          placeholder="Add comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="block w-full inputPill"
          style={{ paddingRight: "40px" }}
        />
        {body && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button disabled={isSaving}>
              <FontAwesomeIcon
                icon={faCircleUp}
                style={{
                  width: "24px",
                  height: "24px",
                  color: "#BF2BC1",
                }}
              />
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
