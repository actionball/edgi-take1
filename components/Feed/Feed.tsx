"use client";

import styles from "./Feed.module.css";
import Slide from "@/components/Feed/Slide";
import { Video } from "@/lib/query.types";
import React, { useRef, useState } from "react";
import CommentsPanel from "./CommentsPanel/CommentsPanel";

// a Tiktok style feed UI component with "For You" and "Following" navigation at the top,
// a creator profile avatar, heart, comment, bookmark, and share buttons along the right side,
// and video details on the bottom,
// all overlaying a video
export default function Feed({ videos }: { videos: Video[] }) {
  // track the index of the top-most video
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // handler for snapping to different videos
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    // if we're not at a snapping point, stop
    if (container.scrollTop % container.clientHeight) return;

    const position = container.scrollTop / container.clientHeight;
    setFocusedIndex(position);
    if (hasInteracted) setIsPlaying(true);
  };

  return (
    <>
      {/* Video List */}
      <div ref={containerRef} className={styles.list} onScroll={handleScroll}>
        {videos.slice(0, focusedIndex + 4).map((video, index) => (
          <div key={video.id} className={styles.container}>
            <Slide
              video={video}
              isPlaying={isPlaying && focusedIndex == index}
              onClickComment={() => setShowComments(true)}
              onClickVideo={() => {
                setHasInteracted(true);
                setIsPlaying(!isPlaying);
              }}
            />
          </div>
        ))}
      </div>

      {/* Top Navigation Overlay */}
      <div className="absolute top-0 left-0 right-0 flex justify-center items-center p-4">
        <button
          className="mx-2 text-lg font-semibold text-white"
          style={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.8)" }}
        >
          For You
        </button>
        <button
          className="mx-2 text-lg font-semibold text-white"
          style={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.8)" }}
        >
          Following
        </button>
      </div>

      {/* Comments overlay */}
      {showComments ? (
        <div className="absolute top-0 left-0 right-0 w-full h-full">
          <CommentsPanel
            video={videos[focusedIndex]}
            onClickClose={() => setShowComments(false)}
          />
        </div>
      ) : null}
    </>
  );
}
