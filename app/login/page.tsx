"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import type { Database } from "@/lib/database.types";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    setError("");
  }, [email, password]);

  const handleSignIn = async () => {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) return setError(response.error.message);
    return redirect("/");
  };

  return (
    <form
      className="p-8 animate-in flex flex-col w-full justify-center gap-4 text-white"
      action={handleSignIn}
    >
      <div className="flex flex-col gap-1">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          name="email"
          type="email"
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
      <button className="button w-full">Log In</button>
      <p className="text-center opacity-50">or</p>
      <Link className="text-center" href="/signup">
        Sign Up
      </Link>
      {error && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {error}
        </p>
      )}
    </form>
  );
}
