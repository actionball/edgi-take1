"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Props = {
  filename: string | null;
  size: number;
  username: string;
};

export default function Avatar({ filename, size, username }: Props) {
  const style: any = { width: size, height: size, fontSize: size / 4 };
  const baseClass =
    "rounded-full flex items-center justify-center font-bold text-white";
  let avatarClass = "bg-blue-500";

  let url = "";
  if (filename) {
    const supabase = createClientComponentClient();
    url = supabase.storage.from("avatars").getPublicUrl(filename)
      .data.publicUrl;

    avatarClass = "bg-cover bg-center bg-no-repeat";
    style.backgroundImage = `url(${url})`;
  }

  return (
    <div className={`${baseClass} ${avatarClass}`} style={style}>
      {!filename && username.slice(0, 1).toUpperCase()}
    </div>
  );
}
