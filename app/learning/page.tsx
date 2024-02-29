"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";
import { useEffect, useState } from "react";

const toTime = (seconds: number): string => {
  if (!seconds) return "0m";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
  return `${Math.ceil(seconds / 3600)}h`;
};
const toTitle = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1);
};

export default function Learning() {
  const supabase = createClientComponentClient<Database>();
  const [viewTimes, setViewTimes] = useState<
    { topic: string; duration: number }[]
  >([]);

  useEffect(() => {
    const fetchTotalViews = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const { data, error } = await supabase.rpc("get_user_view_times", {
        end_at: new Date().toISOString(),
        start_at: start.toISOString(),
        user_id_param: session.user.id,
      });

      if (error) return console.error("Error fetching total views:", error);
      console.log(data);
      setViewTimes(data);
    };

    fetchTotalViews();
  }, []);

  return (
    <>
      <div className="p-8 animate-in flex flex-col w-full justify-center gap-4 text-white">
        {viewTimes.map((viewTime) => (
          <div key={viewTime.topic || "everything"}>
            <h3>{toTitle(viewTime.topic || "everything")}</h3>
            <div className="flex items-center gap-2">
              <div
                className="opacity-50 bg-white"
                style={{
                  width: `${
                    (100 * (viewTime.duration || 1)) /
                    (viewTimes[0].duration || 1)
                  }%`,
                  height: "16px",
                }}
              ></div>
              {toTime(viewTime.duration)}
            </div>
          </div>
        ))}
      </div>

      {/* Top Navigation Overlay */}
      <div className="absolute top-0 left-0 right-0 flex justify-center items-center p-4">
        <button
          className="mx-2 text-lg font-semibold text-white"
          style={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.8)" }}
        >
          Today
        </button>
        <button
          className="mx-2 text-lg font-semibold text-white"
          style={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.8)" }}
        >
          Week
        </button>
        <button
          className="mx-2 text-lg font-semibold text-white"
          style={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.8)" }}
        >
          Month
        </button>
        <button
          className="mx-2 text-lg font-semibold text-white"
          style={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.8)" }}
        >
          Year
        </button>
        <button
          className="mx-2 text-lg font-semibold text-white"
          style={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.8)" }}
        >
          All Time
        </button>
      </div>
    </>
  );
}
