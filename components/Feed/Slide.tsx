"use client";

import React, { useRef, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Video } from "@/lib/query.types";
import { Tables } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";
import Caption from "./Caption";

type View = Tables<"video_views">;

// a Tiktok style feed UI component with "For You" and "Following" navigation at the top,
// a creator profile avatar, heart, comment, bookmark, and share buttons along the right side,
// and video details on the bottom,
// all overlaying a video
export default function Slide({
  isPlaying,
  onClickComment,
  onClickVideo,
  video,
}: {
  isPlaying: boolean;
  onClickComment: () => void;
  onClickVideo: () => void;
  video: Video;
}) {
  const supabase = createClientComponentClient();

  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<number>(0);
  const viewId = useRef<string>("");
  const duration = useRef<number>(0);
  const userId = useRef<string>("");
  const interval = 2;

  const startTracking = () => {
    viewId.current ||= uuidv4();
    // Clear existing interval to avoid duplicates
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      duration.current += interval;
      supabase
        .from("video_views")
        .upsert({
          id: viewId.current,
          user_id: userId.current,
          video_id: video.id,
          duration: duration.current,
          position: Math.round(videoRef.current?.currentTime || 0),
        })
        .then(({ error }) => {
          if (error)
            console.error("Error updating video views:", error.message);
        });
    }, interval * 1000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
    }
  };

  const loadUser = async () => {
    const { data } = await supabase.auth.getSession();
    userId.current = data?.session?.user.id || "";
  };

  useEffect(() => {
    if (!userId.current) loadUser();

    if (isPlaying) {
      videoRef.current?.play();
      startTracking();
    } else {
      videoRef.current?.pause();
      stopTracking();
    }
  }, [isPlaying]);

  return (
    <div className="relative flex flex-col h-full bg-black">
      {/* Video Container */}
      <div className="relative w-full h-full" onClick={onClickVideo}>
        <video
          ref={videoRef}
          src={`https://take1.arrelgray.com/${video.filename}#t=0.1`}
          // src="/videos/7237461060465298734.mp4"
          className="w-full h-full object-cover pointer-events-none"
          playsInline
          preload="metadata"
        ></video>
        <svg
          style={{ display: isPlaying ? "none" : "block" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="150"
          height="150"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50"
          strokeLinejoin="round"
          strokeWidth="5"
          stroke="white"
          fill="white"
        >
          <polygon points="40,30 65,50 40,70"></polygon>
        </svg>
      </div>

      {/* Sidebar */}
      <div className="absolute right-4 top-1/3 space-y-4">
        <Sidebar video={video} onClickComment={onClickComment} />
      </div>

      {/* Bottom Video Details Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
        <span className="font-semibold">@{video.creator?.handle}</span>{" "}
        <Caption caption={video.caption || ""} />
      </div>
    </div>
  );
}
