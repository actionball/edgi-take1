"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import EditAvatar from "./EditAvatar";

export default function EditProfile({ user }: { user: User }) {
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar_filename, setAvatarFilename] = useState("");

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, website, avatar_filename`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarFilename(data.avatar_filename);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [user]);

  async function updateProfile(event?: any) {
    event?.preventDefault();

    setLoading(true);

    const updates = {
      id: user.id,
      username,
      website,
      avatar_filename,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      alert(error.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <form
        onSubmit={updateProfile}
        className="animate-in flex flex-col w-full justify-center gap-4 text-white mb-8"
      >
        <EditAvatar
          filename={avatar_filename}
          username={username}
          size={150}
          onUpload={(filename: string) => {
            setAvatarFilename(filename);
            updateProfile();
          }}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={user.email} disabled />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="username">Name</label>
          <input
            id="username"
            type="text"
            required
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Loading ..." : "Update"}
        </button>
      </form>
      <form action="/auth/signout" method="post">
        <button className="button w-full" type="submit">
          Sign out
        </button>
      </form>
    </div>
  );
}
