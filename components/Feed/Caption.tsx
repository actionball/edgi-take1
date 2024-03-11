"use client";
import { useState } from "react";

export default function Caption({ caption }: { caption: string }) {
  const TRUNCATION_LIMIT = 80;
  const shouldTruncate = caption.length > TRUNCATION_LIMIT + 20;
  const [isTruncated, setIsTruncated] = useState<boolean>(shouldTruncate);

  return (
    <p>
      {isTruncated ? `${caption.slice(0, TRUNCATION_LIMIT)}...` : caption}
      {shouldTruncate ? (
        <>
          {" "}
          <button
            onClick={() => setIsTruncated(!isTruncated)}
            className="text-white/80 hover:text-white"
          >
            {isTruncated ? "more" : "less"}
          </button>
        </>
      ) : null}
    </p>
  );
}
