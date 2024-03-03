"use client";
import { useEffect, useState } from "react";

export default function Caption({ caption }: { caption: string | null }) {
  // track if the caption is truncated
  const [isCaptionTruncated, setIsCaptionTruncated] = useState<boolean>(false);
  // caption shown on the video slide
  const [displayCaption, setDisplayCaption] = useState<string | null>(caption);
  // track if the caption is expanded
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const truncationCharacterLimit = 80;

  // truncate the caption if it's is greater than truncationCharacterLimit
  useEffect(() => {
    if (caption && caption.length > 100) {
      setIsCaptionTruncated(true);
      setDisplayCaption(caption.slice(0, truncationCharacterLimit) + "...");
    }
  }, [caption]);

  // toggle expansion state when the "more" or "less" button is clicked
  const handleExpansion = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setDisplayCaption(caption?.slice(0, truncationCharacterLimit) + "...");
    } else {
      setDisplayCaption(caption);
    }
  };

  return (
    <div>
      <p className="inline">{displayCaption}</p>
      {isCaptionTruncated && (
        <>
          {" "}
          <button onClick={handleExpansion} className="text-white/80">
            {isExpanded ? "less" : "more"}
          </button>
        </>
      )}
    </div>
  );
}
