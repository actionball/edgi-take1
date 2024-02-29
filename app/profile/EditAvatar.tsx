"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function EditAvatar({
  filename,
  username,
  size,
  onUpload,
}: {
  filename: string;
  username: string;
  size: number;
  onUpload: any;
}) {
  const [avatarFilename, setAvatarFilename] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (filename) downloadImage(filename);
  }, [filename]);

  async function downloadImage(path: string) {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const filename = URL.createObjectURL(data);
      setAvatarFilename(filename);
    } catch (error: any) {
      console.warn("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const supabase = createClientComponentClient();
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filename = `${Math.random()
        .toString(20)
        .substring(2, 20)}.${fileExt}`;

      const response = await supabase.storage
        .from("avatars")
        .upload(filename, file);

      if (response.error) {
        throw response.error;
      }

      onUpload(filename);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {avatarFilename ? (
        <img
          src={avatarFilename}
          alt="Avatar"
          className="object-cover rounded-full"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center font-bold text-white bg-blue-500"
          style={{ height: size, width: size, fontSize: Math.round(size / 4) }}
        >
          {username.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div style={{ width: size }}>
        <label className="button primary block cursor-pointer" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
