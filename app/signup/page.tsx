"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import type { Database } from "@/lib/database.types";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    setError("");
  }, [email, password, username]);

  const handleSignUp = async () => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (response.error) return setError(response.error.message);
    return redirect("/");
  };

  return (
    <form
      className="p-8 animate-in flex flex-col w-full justify-center gap-4 text-white"
      action={handleSignUp}
    >
      <div className="flex flex-col gap-1">
        <label className="text-md" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          name="username"
          placeholder="yourname"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
      </div>
      <button className="button w-full">Sign Up</button>
      <p className="text-center opacity-50">or</p>
      <Link className="text-center" href="/login">
        Log In
      </Link>
      {error && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {error}
        </p>
      )}
    </form>
  );
}
