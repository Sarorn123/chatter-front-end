"use client";

import { loginService } from "@/help/api";
import { checkAuth } from "@/help/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import PleaseWait from "../components/PleaseWait";

interface IUser {
  _id: string;
  username: string;
  avatar: string;
}

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    if (checkAuth()) router.replace("/");
    else setIsAuthLoading(false);
  }, []);

  async function login() {
    if (username && password) {
      setLoading(true);
      const response = await loginService(username, password);

      if (response.status === 200) {
        localStorage.setItem(
          "chat-currentUser",
          JSON.stringify(response.data.user)
        );
        router.push("/");
      } else {
        toast.error(response.message);
      }

      setLoading(false);
    }
  }

  return isAuthLoading ? (
    <PleaseWait />
  ) : (
    <>
      <Toaster />

      <div className="flex flex-col gap-5 md:w-1/2 lg:w-1/4   absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <h1 className="text-blue-600 font-bold text-2xl">
          Wellcome to Chatter 💕❤
        </h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="mt-32 bg-blue-600 px-4 py-2 rounded-md text-white active:bg-blue-500"
          disabled={loading}
        >
          {loading ? "Loading ..." : "Log In"}
        </button>

        <Link href={"/register"}>
          <button className="mt-32 w-full border border-blue-600 px-4 py-2 rounded-md text-white active:bg-blue-500">
            Go To Register
          </button>
        </Link>
      </div>
    </>
  );
};

export default Login;
